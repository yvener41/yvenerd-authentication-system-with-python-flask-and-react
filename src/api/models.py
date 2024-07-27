from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user_table"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    invoices = db.relationship("Invoice", back_populates="user")

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }

class Invoice(db.Model):
    __tablename__ = "invoice_table"
    id = db.Column(db.Integer, primary_key=True)
    invoice_date = db.Column(db.String(120), unique=False, nullable=False)
    invoice_number = db.Column(db.String(120), unique=True, nullable=False)
    invoice_amount = db.Column(db.Float, unique=False, nullable=False)
    # ForeignKey many side : one user can have many invoices
    user_id = db.Column(db.ForeignKey("user_table.id")) 
    user = db.relationship("User", back_populates="invoices")

    def __repr__(self):
        return f'<Invoice {self.invoice_number}>'
    
    def serialize(self):
        return {
            "invoice_date": self.invoice_date,
            "invoice_number": self.invoice_number,
            "invoice_amount": self.invoice_amount,
            # do not serialize the password, its a security breach
        }