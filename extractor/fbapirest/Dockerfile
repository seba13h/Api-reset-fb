FROM phusion/passenger-customizable:0.9.32
ENV HOME /root

CMD ["npm" , "start"]

EXPOSE 8080

ENV LANGUAGE en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8
ENV PYTHONIOENCODING UTF-8
ENV TERM xterm

RUN apt-get update

RUN /pd_build/utilities.sh

RUN apt-get install -y nano wget

RUN wget https://deb.nodesource.com/setup_11.x

RUN bash setup_11.x

RUN apt-get install -y nodejs

COPY package.json ./

RUN npm install

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*



# Disable cron
RUN echo manual | tee /etc/init/cron.override

VOLUME /home/app/code
WORKDIR /home/app/code
