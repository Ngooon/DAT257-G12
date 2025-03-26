# Project in DAT257

## Introduction
We're using Git for version control. To keep things neat and tidy, we've got some rules for committing and merging changes.

## Getting Started
To start working on this project, first clone the repository to your local machine:
```bash
git clone https://github.com/your-username/your-repo.git
```

### Create a New Branch
Before making any changes, create a new branch and give it a cool name like `my-feature-name`.

```bash
git checkout -b my-feature-name
```

### Make Changes and Commit
Make your changes and commit them with a message that tells us what you've done.

```bash
git add .
git commit -m "Description of your changes"
```

### Push Your Changes
Push your branch to GitHub so everyone can see your awesome work.

```bash
git push origin my-feature-name
```

### Create a Pull Request
Head over to GitHub and create a Pull Request (PR) from your branch to the main branch. Tell us what you've changed and why it's needed.

Another team member will review the PR. Once it's approved, it's ready to be merged into the main branch. 🎉

```
git checkout main
git pull origin main
git merge my-feature-name
git push origin main
```

Happy coding! 🚀