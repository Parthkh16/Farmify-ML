from flask import Flask, render_template, redirect, url_for, flash, request
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, EqualTo
from sqlalchemy.exc import IntegrityError

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'  # Replace with a strong secret key
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'  # Use SQLite for simplicity
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    farms = db.relationship('Farm', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Farm(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    soil_type = db.Column(db.String(150))
    moisture_level = db.Column(db.String(50))
    temperature = db.Column(db.String(50))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register')

@app.route('/')
def home():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return render_template('home.html')

@app.route('/dashboard')
@login_required
def dashboard():
    farm = Farm.query.filter_by(user_id=current_user.id).first()  # Fetch farm from DB
    return render_template('dashboard.html', farm_details=farm) #pass the farm object

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))

    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=True)
            flash("Login successful!", "success")
            return redirect(url_for('dashboard'))
        else:
            flash("Invalid email or password.", "danger")
    return render_template('login.html', form=form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))

    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        try:
            db.session.commit()
            flash("Account created successfully!", "success")
            return redirect(url_for('login'))
        except IntegrityError:
            db.session.rollback()
            flash("Email or Username already registered!", "danger")
    return render_template('register.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash("Logged out successfully.", "info")
    return redirect(url_for('home'))

@app.route('/debug')
def debug():
    from flask import current_app
    db_path = current_app.config['SQLALCHEMY_DATABASE_URI']
    return f"App: {current_app}, SQLAlchemy: {db}, Database Path: {db_path}"

@app.route('/update_farm', methods=['POST'])
@login_required
def update_farm():
    farm = Farm.query.filter_by(user_id=current_user.id).first()
    if farm:
        farm.name = request.form.get('farm_name')
        farm.soil_type = request.form.get('soil_type')
        farm.moisture_level = request.form.get('moisture_level')
        farm.temperature = request.form.get('temperature')
    else:
        farm = Farm(
            name=request.form.get('farm_name'),
            soil_type=request.form.get('soil_type'),
            moisture_level=request.form.get('moisture_level'),
            temperature=request.form.get('temperature'),
            user_id=current_user.id
        )
        db.session.add(farm)
    db.session.commit()
    flash("Farm details updated!", "success")
    return redirect(url_for('dashboard'))

@app.route('/delete_farm')
@login_required
def delete_farm():
    farm = Farm.query.filter_by(user_id=current_user.id).first()
    if farm:
        db.session.delete(farm)
        db.session.commit()
        flash("Farm deleted!", "success")
    return redirect(url_for('dashboard'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5003)