FROM node:alpine as build
WORKDIR /resource-manager-frontend
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build --omit=dev

FROM nginx:alpine
# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/*.conf

# Copy your custom Nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/
#copy build file
COPY --from=build /resource-manager-frontend/dist/resource-manager-frontend/browser /usr/share/nginx/html