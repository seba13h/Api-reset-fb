FROM phusion/passenger-customizable:0.9.32
ENV HOME /root

CMD ["/sbin/my_init"]
ENV LANGUAGE en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8
ENV PYTHONIOENCODING UTF-8
ENV TERM xterm

RUN apt-get update

RUN /pd_build/utilities.sh
RUN /pd_build/redis.sh

# Allow redis remote connections
RUN sed -i "s/.*bind.*/bind 0.0.0.0/" /etc/redis/redis.conf

# Disable persistence
RUN sed -e '/save/ s/^#*/#/' -i /etc/redis/redis.conf

# Enable the Redis service.
RUN rm -f /etc/service/redis/down

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Disable cron
RUN echo manual | tee /etc/init/cron.override

EXPOSE 6379
