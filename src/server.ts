import express, {Router, Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user

  //CORS Should be restricted
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8100");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
  
  app.get( "/", async ( req, res ) => {

    res.send("try GET /filteredimage?image_url={{}}")
  } );

  app.get("/filteredimage", async (req:Request, res:Response, next ) =>{

    let {image_url} = req.query

    if(!image_url){
      return res.status(400).send({message:"Bad Request- must include image url"})
    }

    filterImageFromURL(image_url).catch(e=>{
      return res.status(400).send('Unable to filter image')

    }).then(image => {

      if (image.toString() == "error"){
        return res.status(400).send('invalid')
      }
      return res.on('finish', () =>{
        let fileArray: string[] = [image.toString()]
        deleteLocalFiles(fileArray);
      }).status(200).sendFile(image.toString())
      
    })
        
  });


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();