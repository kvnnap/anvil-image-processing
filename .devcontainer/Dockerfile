FROM node:latest

# Use included node user
ARG USERNAME=node

# Install basic development tools and
# ensure default `node` user has access to `sudo`
RUN apt update && apt install -y less man-db sudo && \
    echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

USER $USERNAME
