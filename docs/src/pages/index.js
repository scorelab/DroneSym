import React from "react"
import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
     <div style={{ maxWidth: `200px`, marginBottom: `0.6rem`,display:'block',marginLeft: `auto`,marginRight: `auto`}}>
      <Image />
    </div>
    <SEO title="Home" />
    <h2>Project Introduction</h2>
    <p>DroneSym is a web-based platform for tracking and managing drone fleets in real-time. It provides the ability to configure the flight paths and monitor their status through an online dashboard. Add, configure, and monitor entire fleets of drones through a web-browser.</p>
    <h2>Requirements</h2>
    DroneSym requires <br/> 
    <br/> 
    <ul>
      <li>Node.js 6.x or higher - <a href="https://nodejs.org"> https://nodejs.org</a> [Official website]- <a href="https://github.com/nodesource/distributions/blob/master/README.md">[NodeSource]</a> - for Debian-based distributions.</li>

      <li>Python 2.7.x - <a href="https://www.python.org/"> https://www.python.org </a> [Official website]</li>
    </ul>
   

    <h2>Installation</h2>
    
  <h4>Clone the repository</h4>
      <code>$ git clone https://github.com/scorelab/DroneSym</code>

      <h4>Navigate to the `dronesym-node` folder and install Node dependencies required by DroneSym.</h4>
      <code>$ npm install</code>
      <h4>Navigate to the `dronesym-python` folder and install the Python dependencies.</h4>
      <code>$ sudo pip install -r requirements.txt</code>
      <h4>Install AngularCLI for the front-end.</h4>
      <code>$ npm install -g @angular/cli</code>

    <h2 id="heading_2">Configuration </h2>

    <h4>Setting up the Node & MongoDB environment</h4>
        <ol> 
            <li>Open up a terminal and run <code>  -  mongod --replSet rs</code></li>
            <li>Run <code>`npm start`</code> to start the Node server.</li>
            <h5>** Note: Make sure you have an admin account in the database under user collection. (Refer the schema in Models folder)</h5>
    </ol>


    <h4>Setting up the Python environment</h4>
        <ol> 
            <li>Open up a terminal and navigate to `dronsym-python/flask-api/src` folder.</li>
            <li>Run <code>`python main.py`</code> to start the Flask server.</li> 
      
            <h6>** Note: Node server should be running when starting up the Flask server.**</h6>
      </ol>

      <h4>Setting up the Angular front-end</h4>
        <ol> 
            <li>Set environmental variable in `./dronesym-frontend/src/environments/environment.ts` <br></br>
            <h6>** You will have to rename the `example.environment.ts` to `environment.ts` or create new file, for example by copying the example file : <br></br>
              <code> $ cp src/environments/example.environment.ts src/environments/environment.ts`</code>**</h6>
              <code>mapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY', <br></br>
nodeApiURL: 'http://localhost:3000/dronesym/api/node', <br></br>
feedURL: 'http://localhost:3000/feed'</code></li>
            <li>Starting the Angular development server: <br></br><code>$ npm install <br></br>
              $ ng serve</code></li> 
      
            <h6>** DroneSym Node server (`./dronesym-node/`) and DroneSym Flask server (`./dronesym-python/flask-api/src`) should be running before starting the frontend server.**</h6>
      </ol>


      <h4>Running with Init Script [Optional]</h4>
      <ul> 
            <li>Navigate to `./initScripts/`, make it executable & run <code>./start.sh</code><br></br></li>
            <h6>** Instructions - Check ./initScripts/instructions.md' **</h6>
      </ul>
    <h2>Usage</h2>
    <h4>Default login credentials</h4>
    
    <h5> Admin <br></br><br></br>username: admin<br></br>password: admin</h5>



    
<h5> User <br></br><br></br>username: icarus <br></br> password: icarus</h5>

    <h2>Contributing</h2>
    <p>This project conforms to the Contributor Covenant Code of Conduct. 
    <a href="https://github.com/scorelab/DroneSym/blob/develop/CODE_OF_CONDUCT.md"> See here.</a>
    </p>
    <h2>Help</h2>
<p>For more information and assistance regarding this project, use one of the mentioned communication channels to reach out.
See <a href="https://gitter.im/scorelab/DroneSym">Gitter Channel</a>
</p>
    

    <h2>Credits </h2>
    DroneSym is developed and managed as a free and open source software by <strong>ScoReLab</strong> - Sustainable Computing Research Lab. ScoreLab conducts research covering various aspects of WASN, Security, and Mobile technologies.

    <h2>Contact</h2>
    <ul>
      <li>Website - http://www.scorelab.org/ </li>
      <li>Email: info@scorelab.org </li>
    </ul>
    

<h2>License</h2>
<div id="bold">Apache License 2.0</div>
<p>DroneSym is licensed under the Apache License 2.0 - A permissive license whose main conditions require preservation of copyright and license notices. Contributors provide an express grant of patent rights. Licensed works, modifications, and larger works may be distributed under different terms and without source code.</p>
<a href="https://github.com/scorelab/DroneSym/blob/develop/LICENSE">Link to License</a>
   
  </Layout>
)

export default IndexPage
