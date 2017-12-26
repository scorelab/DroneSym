FROM python:2
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY requirements.txt /usr/src/app
RUN pip install -r requirements.txt
COPY ./flask-api/src /usr/src/app
EXPOSE 5000
CMD ["python", "-u", "main.py"LABEL multi.org.label-schema.name = "DroneSym" \
      
LABEL multi.org.label-schema.name = "DroneSym" \
      multi.org.label-schema.description = "Dronesym is a platform enabling users to handle and track their drone fleets in real time. Users can have functionality to add new drones configure their flight paths and monitor their progress through a web dashboard." \
      multi.org.label-schema.url = "https://github.com/scorelab/DroneSym/blob/master/README.md" \
      multi.org.label-schema.vcs-url = "https://github.com/scorelab/DroneSym" \
      multi.org.label-schema.vcs-ref = "279FA63" \
      multi.org.label-schema.vendor = "Sustainable Computing Research Group" \
      multi.org.label-schema.version = "09-December-2017" \
      multi.org.label-schema.schema-version = "1.0"
