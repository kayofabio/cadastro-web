from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route("/")
def homePage():
    return render_template("cadastro.html")

@app.route("/cadastrar", methods=["POST"])
def cadastrar():
    nome = request.form["nome"]
    return redirect(url_for("confirmacao", nome=nome))

@app.route("/confirmacao", )
def confirmacao():
    nome = request.args.get("nome")
    return render_template("confirmacao.html", nome=nome)

if __name__ == "__main__":
    app.run()