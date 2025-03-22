# Use an Nginx server to serve static files
FROM nginx:alpine

# Remove default Nginx static resources
RUN rm -rf /usr/share/nginx/html/*

# Copy React build files into Nginx directory
COPY build/ /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
