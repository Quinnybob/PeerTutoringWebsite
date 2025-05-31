from flask import Flask, render_template, request, redirect, url_for, session
import pandas as pd
import os
import csv

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

# Read tutor data once at startup
try:
    tutoring_df = pd.read_csv('tutors.csv', encoding='latin1')
except FileNotFoundError:
    tutoring_df = pd.DataFrame(columns=[
        'first_name', 'last_name', 'email', 'phone', 
        'display_name', 'grade', 'gpa', 'subjects', 'times'
    ])
    tutoring_df.to_csv('tutors.csv', index=False, encoding='latin1')

def parse_list(cell):
    if pd.isna(cell):
        return set()
    return set(item.strip().lower().replace('�', '') for item in cell.split(';') if item.strip())

STANDARD_SUBJECTS = [
    "Algebra 1", "Algebra 2", "Geometry", "Precalculus", "Calculus",
    "Biology", "Chemistry", "Physics",
    "English", "History", "Computer Science"
]

TIME_SLOTS = [
    "Monday 3-5", "Monday 5-7",
    "Tuesday 3-5", "Tuesday 5-7",
    "Wednesday 3-5", "Wednesday 5-7",
    "Thursday 3-5", "Thursday 5-7",
    "Friday 3-5", "Friday 5-7"
]

def match_student_to_tutors(student_subjects, student_times):
    matches = []
    for subject in student_subjects:
        best_tutor = None
        best_score = 0
        best_subjects = set()
        for _, tutor in tutoring_df.iterrows():
            tutor_subjects = parse_list(tutor.iloc[7])
            tutor_times = parse_list(tutor.iloc[8])
            if subject.lower() in tutor_subjects:
                shared_times = student_times & tutor_times
                score = 1 + 0.5 * len(shared_times)
                if score > best_score:
                    best_score = score
                    best_tutor = tutor.iloc[4]  # display_name
                    best_subjects = {subject}
        matches.append({
            'subject': subject,
            'tutor': best_tutor or "No suitable tutor found",
            'score': round(best_score, 2),
            'matched_for': subject
        })
    return matches

@app.route('/')
def entrance():
    return render_template('entrance.html')

@app.route('/find-tutor', methods=['GET', 'POST'])
def find_tutor():
    if request.method == 'POST':
        name = request.form['name']
        subjects = set(request.form.getlist('subjects'))
        times = set(request.form.getlist('times'))
        results = match_student_to_tutors(subjects, times)
        return render_template('index.html', name=name, results=results,
                               subjects=STANDARD_SUBJECTS, times=TIME_SLOTS)
    return render_template('index.html', results=None,
                           subjects=STANDARD_SUBJECTS, times=TIME_SLOTS)

@app.route('/become-tutor', methods=['GET', 'POST'])
def become_tutor():
    success = False
    if request.method == 'POST':
        new_tutor = {
            'first_name': request.form['first_name'],
            'last_name': request.form['last_name'],
            'email': request.form['email'],
            'phone': request.form['phone'],
            'display_name': request.form['display_name'],
            'grade': request.form['grade'],
            'gpa': request.form['gpa'],
            'subjects': ';'.join(request.form.getlist('subjects')),
            'times': ';'.join(request.form.getlist('times'))
        }
        file_exists = os.path.isfile('tutors.csv')
        with open('tutors.csv', 'a', newline='', encoding='latin1') as f:
            writer = csv.DictWriter(f, fieldnames=new_tutor.keys())
            if not file_exists:
                writer.writeheader()
            writer.writerow(new_tutor)
        global tutoring_df
        tutoring_df = pd.read_csv('tutors.csv', encoding='latin1')
        success = True
    return render_template('tutor_form.html', subjects=STANDARD_SUBJECTS,
                           times=TIME_SLOTS, success=success)

def check_user_credentials(email, password):
    if not os.path.exists('users.csv'):
        return False
    with open('users.csv', newline='') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if row['email'] == email and row['password'] == password:
                return True
    return False

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        file_exists = os.path.isfile('users.csv')
        with open('users.csv', 'a', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=['email', 'password'])
            if not file_exists:
                writer.writeheader()
            writer.writerow({'email': email, 'password': password})
        return redirect('/login')
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        if check_user_credentials(email, password):
            session['user'] = email
            return redirect('/')
        else:
            error = 'Invalid email or password.'
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)
