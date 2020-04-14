from flask import Flask, render_template
app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/keystage")
def results():
    return render_template('keystage.html')

@app.route("/education")
def education():
    return render_template('education.html')

@app.route("/gsce")
def schools():
    return render_template('gsce.html')

@app.route("/language")
def language():
    return render_template('language.html')

@app.route("/aLevels")
def alevels():
    return render_template('aLevels.html')

@app.route("/international")
def international():
    return render_template('international.html')

@app.route("/workingage")
def workingage():
    return render_template('qWorkingAge.html')

#@app.route("/test")
#def test():
#   return render_template('test.html')

#@app.route("/getsomethingData")
#def getData(); 
#   return render_template('')

if __name__ == '__main__':
    app.run(debug=True)