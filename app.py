from flask import Flask, render_template, request, redirect, url_for, session, flash
import sqlite3, os
from werkzeug.security import generate_password_hash, check_password_hash
from cryptography import fernet
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
DATABASE_PATH = os.getenv("DATABASE_PATH")

key = os.getenv("FERNET_KEY")
cipher = fernet.Fernet(key)

def criar_bd():
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS usuarios "
    "(id INTEGER PRIMARY KEY AUTOINCREMENT, " \
    "nome TEXT NOT NULL, " \
    "email TEXT NOT NULL, " \
    "telefone TEXT NOT NULL, " \
    "cpf TEXT NOT NULL, " \
    "data_nascimento TEXT NOT NULL," \
    "senha TEXT NOT NULL)")
    conn.close()

criar_bd()

def validar_dados_usuario():
    pass

@app.route("/")
def homePage():
    session.clear()
    return render_template("cadastro.html")

@app.route("/cadastrar", methods=["POST"])
def cadastrar():
    senha_hash = generate_password_hash(request.form["senha"])
    cpf = request.form["cpf"]
    cpf_cript = cipher.encrypt(cpf.encode())

    usuario = {
        "id": None,
        "nome": request.form["nome"],
        "email": request.form["email"],
        "telefone": request.form["telefone"],
        "cpf": cpf_cript,
        "data_nascimento": request.form["nascimento"],
        "senha": senha_hash
    }

    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute('''
                   INSERT INTO usuarios (id, nome, email, telefone, cpf, data_nascimento, senha)
                   VALUES (:id, :nome, :email, :telefone, :cpf, :data_nascimento, :senha)
                   ''', usuario)
    conn.commit()
    conn.close()

    return redirect(url_for("confirmacao", nome=usuario["nome"]))

@app.route("/confirmacao")
def confirmacao():
    nome = request.args.get("nome")
    return render_template("confirmacao.html", nome=nome)

def get_db():
    return sqlite3.connect(os.getenv("DATABASE_PATH", "database.db"))

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        senha = request.form["senha"]

        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT id, nome, senha FROM usuarios WHERE email = ?", (email,))
        user = cursor.fetchone()
        db.close()

        if user and check_password_hash(user[2], senha):
            session["user_id"] = user[0]
            session["user_nome"] = user[1]
            flash("Login realizado com sucesso!", "success")
            return redirect(url_for("home"))
        else:
            flash("CPF ou senha incorretos.", "danger")

    return render_template("login.html")

@app.route("/home")
def home():
    if "user_id" not in session:
        return redirect(url_for("login"))
    nome = session.get("user_nome")
    return render_template("home.html", nome=nome)

@app.route("/logout")
def logout():
    session.clear()
    flash("Você saiu da conta com sucesso!", "info")
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run(debug=os.getenv("FLASK_DEBUG") == "True")