cd /home/freesit2/public_html/laravel/
php artisan migrate:refresh --seed

## Git Workflow for Bugfix Branches

### Step 1: Go to the `develop` branch

```bash
git checkout develop
```

### Step 2: Get the latest changes from `develop` to avoid conflicts

```bash
git pull origin develop
```

### Step 3: Create your own branch

```bash
git checkout -b bugfix/contactus
```

### Step 4: Work on your changes and push them to the remote repository

```bash
git add .
git commit -m "Your commit message here"
git push origin bugfix/contactus
```

### Step 5: After pushing your changes, return to the `develop` branch

```bash
git checkout develop
```

### Step 6: Delete your created branch both locally and remotely

```bash
git branch -d bugfix/contactus
git push origin --delete bugfix/contactus
```

### Step 7: Get the latest changes in `develop`. First, go back to your branch:

```bash
git checkout <your-branch>
git fetch origin
git merge origin/develop
```

### Optional: Clean Up Stale Remote Branches

If you encounter issues like `cannot lock ref` errors during `git fetch`, run:

```bash
git remote prune origin
```
