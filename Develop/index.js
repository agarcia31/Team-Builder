const Manager = require('./lib/Manager');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');

const DIST_DIR = path.resolve(__dirname, 'dist');
const distPath = path.join(DIST_DIR, 'team.html');

const render = require('./src/page-template.js');

const teamMembers = [];
const idArray = [];

// I
console.log(
  '\nWelcome! Lets build a team!\n'
);

function appMenu() {
  function createManager() {
    console.log('Build your team');
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'managerName',
          message: "What is the manager name?",
          validate: (answer) => {
            if (answer !== '') {
              return true;
            }
            return 'Please enter their name before we continue.';
          },
        },
        {
          type: 'input',
          name: 'managerId',
          message: "What is the manager id number?",
          validate: (answer) => {
            const pass = answer.match(/^[1-9]\d*$/);
            if (pass) {
              return true;
            }
            return 'Please enter their id number.';
          },
        },
        {
          type: 'input',
          name: 'managerEmail',
          message: "What is the manager email?",
          validate: (answer) => {
            const pass = answer.match(/\S+@\S+\.\S+/);
            if (pass) {
              return true;
            }
            return 'Please enter their email address.';
          },
        },
        {
          type: 'input',
          name: 'managerOfficeNumber',
          message: "What is the manager office number?",
          validate: (answer) => {
            const pass = answer.match(/^[1-9]\d*$/);
            if (pass) {
              return true;
            }
            return 'Please enter their office number.';
          },
        },
      ])
      .then((answers) => {
        const manager = new Manager(
          answers.managerName,
          answers.managerId,
          answers.managerEmail,
          answers.managerOfficeNumber
        );
        teamMembers.push(manager);
        idArray.push(answers.managerId);
        createTeam();
      });
  }

  function createTeam() {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'memberChoice',
          message: 'Which one would you like to add?',
          choices: [
            'Engineer',
            'Intern',
            "Nothing",
          ],
        },
      ])
      .then((userChoice) => {
        switch (userChoice.memberChoice) {
          case 'Engineer':
            addEngineer();
            break;
          case 'Intern':
            addIntern();
            break;
          default:
            buildTeam();
        }
      });
  }

  function addEngineer() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'engineerName',
          message: "What is the engineer name?",
          validate: (answer) => {
            if (answer !== '') {
              return true;
            }
            return 'Please enter their name before we continue.';
          },
        },
        {
          type: 'input',
          name: 'engineerId',
          message: "What is your engineer id number?",
          validate: (answer) => {
            const pass = answer.match(/^[1-9]\d*$/);
            if (pass) {
              if (idArray.includes(answer)) {
                return 'This ID is already taken buddy.';
              } else {
                return true;
              }
            }
            return 'Please enter their id number before we continue.';
          },
        },
        {
          type: 'input',
          name: 'engineerEmail',
          message: "What is the engineer email?",
          validate: (answer) => {
            const pass = answer.match(/\S+@\S+\.\S+/);
            if (pass) {
              return true;
            }
            return 'Please enter their email address.';
          },
        },
        {
          type: 'input',
          name: 'engineerGithub',
          message: "What is your engineer GitHub username?",
          validate: (answer) => {
            if (answer !== '') {
              return true;
            }
            return 'Please enter their Github username.';
          },
        },
      ])
      .then((answers) => {
        const engineer = new Engineer(
          answers.engineerName,
          answers.engineerId,
          answers.engineerEmail,
          answers.engineerGithub
        );
        teamMembers.push(engineer);
        idArray.push(answers.engineerId);
        createTeam();
      });
  }

  function addIntern() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'internName',
          message: "What is your intern name?",
          validate: (answer) => {
            if (answer !== '') {
              return true;
            }
            return 'Please enter their name before we continue.';
          },
        },
        {
          type: 'input',
          name: 'internId',
          message: "What is your intern id number?",
          validate: (answer) => {
            const pass = answer.match(/^[1-9]\d*$/);
            if (pass) {
              if (idArray.includes(answer)) {
                return 'This ID is already taken buddy.';
              } else {
                return true;
              }
            }
            return 'Please enter their id number.';
          },
        },
        {
          type: 'input',
          name: 'internEmail',
          message: "What is your intern email?",
          validate: (answer) => {
            const pass = answer.match(/\S+@\S+\.\S+/);
            if (pass) {
              return true;
            }
            return 'Please enter their email address.';
          },
        },
        {
          type: 'input',
          name: 'internSchool',
          message: "What is your intern school?",
          validate: (answer) => {
            if (answer !== '') {
              return true;
            }
            return 'Please enter their school.';
          },
        },
      ])
      .then((answers) => {
        const intern = new Intern(
          answers.internName,
          answers.internId,
          answers.internEmail,
          answers.internSchool
        );
        teamMembers.push(intern);
        idArray.push(answers.internId);
        createTeam();
      });
  }

  function buildTeam() {
    // Create the output directory if the dist path doesn't exist
    if (!fs.existsSync(DIST_DIR)) {
      fs.mkdirSync(DIST_DIR);
    }
    fs.writeFileSync(distPath, render(teamMembers), 'utf-8');
  }

  createManager();
}

appMenu();