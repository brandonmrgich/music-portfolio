#!/bin/bash

# Define variables
SERVER="oracle-node-admin"                        # SSH alias
USER="node-admin"                                 # User on the server
BACKEND_DIR="/home/$USER/music-portfolio-backend" # Path to backend
TAR_NAME="music-portfolio-backend.tar.gz"         # Tarball name
LOCAL_TAR_PATH="${HOME}/tmp/${TAR_NAME}"          # Temporary path for tarball (using ~/tmp)
PM2_PROCESS_NAME="backend-server"                 # PM2 process name
LOCAL_BACKEND_DIR="../backend"                    # Local backend directory to tar (relative path)

# Check if dry-run flag is passed
DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
    DRY_RUN=true
    echo "Dry-run mode activated. No changes will be made."
fi

# Function to log actions (for dry-run mode)
log_action() {
    if [ "$DRY_RUN" = true ]; then
        echo "[DRY-RUN] $1"
    else
        echo "$1"
    fi
}

# Step 1: Tar the backend directory (excluding node_modules if necessary)
log_action "Tarring the backend folder..."
if [ "$DRY_RUN" = false ]; then
    tar --exclude='node_modules' -czf $LOCAL_TAR_PATH -C $LOCAL_BACKEND_DIR .
else
    echo "[DRY-RUN] Tar would be created: $LOCAL_TAR_PATH (excluding node_modules)"
fi

# Step 2: Copy the tarball to the server
log_action "Copying the tarball to the server..."
if [ "$DRY_RUN" = false ]; then
    scp $LOCAL_TAR_PATH $SERVER:$BACKEND_DIR
else
    echo "[DRY-RUN] Tarball would be copied to $SERVER:$BACKEND_DIR"
fi

# Step 3: SSH into the server to extract and deploy
log_action "SSH-ing into the server to deploy..."
ssh $SERVER <<'EOF'

    echo "[DEPLOYMENT LOG] Deploying backend to the server as $USER..."

    export SERVER="oracle-node-admin"                        # SSH alias
    export USER="node-admin"                                 # User on the server
    export BACKEND_DIR="/home/$USER/music-portfolio-backend" # Path to backend
    export TAR_NAME="music-portfolio-backend.tar.gz"         # Tarball name
    export PM2_PROCESS_NAME="backend-server"                 # PM2 process name

    # Navigate to backend directory
    echo "[DEPLOYMENT LOG] Navigating to backend directory: $BACKEND_DIR"
    cd ${BACKEND_DIR}

    # Extract the tarball
    echo "[DEPLOYMENT LOG] Extracting the tarball..."
    tar -xzf ${BACKEND_DIR}/${TAR_NAME} -C ${BACKEND_DIR}

    # Install dependencies
    echo "[DEPLOYMENT LOG] Installing dependencies..."
    npm install

    # Check if the PM2 process is running
    echo "[DEPLOYMENT LOG] Checking PM2 process status for $PM2_PROCESS_NAME..."
    pm2 show $PM2_PROCESS_NAME > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "[DEPLOYMENT LOG] PM2 process $PM2_PROCESS_NAME is running. Restarting the process..."
        pm2 restart $PM2_PROCESS_NAME
    else
        echo "[DEPLOYMENT LOG] PM2 process $PM2_PROCESS_NAME is not running. Starting the process..."
        pm2 start server.js --name $PM2_PROCESS_NAME --watch # Start PM2 with the app
    fi

    # Save the PM2 process list (optional for persistence)
    echo "[DEPLOYMENT LOG] Saving the PM2 process list..."
    pm2 save

    # Remove the tar
    rm -f ${BACKEND_DIR}/${TAR_NAME}
EOF

# Clean up by removing the local tarball
log_action "Cleaning up the local tarball..."
if [ "$DRY_RUN" = false ]; then
    rm -f $LOCAL_TAR_PATH
else
    echo "[DRY-RUN] Tarball would be removed: $LOCAL_TAR_PATH"
fi

log_action "Dry-run mode complete. No changes were made."
