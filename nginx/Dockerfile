FROM nginx:1.18

# RUN mkdir -p /etc/nginx/api_conf.d

COPY api_conf.d/acms-auth.conf /etc/nginx/api_conf.d/acms-auth.conf
COPY api_conf.d/acms-meta.conf /etc/nginx/api_conf.d/acms-meta.conf
COPY api_conf.d/acms-master-datastructures.conf /etc/nginx/api_conf.d/acms-master-datastructures.conf
COPY api_conf.d/acms-scalablehosting-msmanagement.conf /etc/nginx/api_conf.d/acms-scalablehosting-msmanagement.conf
COPY api_backends.conf /etc/nginx/api_backends.conf
# COPY api_gateway.conf /etc/nginx/api_gateway.conf
# COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf
COPY welcome/index.html /usr/share/nginx/html/index.html