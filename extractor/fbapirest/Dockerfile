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
RUN /pd_build/nodejs.sh

RUN apt-get install -y nano

RUN npm install pm2 -g 

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Disable cron
RUN echo manual | tee /etc/init/cron.override

EXPOSE 7005

VOLUME /home/app/code
WORKDIR /home/app/code

