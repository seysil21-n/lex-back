class FileUploads {
    constructor(multer) {
        this.multer = multer;
        this.fileStorageEngine = this.multer.diskStorage({
            destination: (req,file,cb) => {
                cb(null, __dirname + '../../../frontend/lexpay/src/profilePictures' )
            },
            filename: (req,file,cb) => {
                cb(null, Date.now() + file.originalname)
            }
        })
        this.upload  = this.multer({storage: this.fileStorageEngine, fileFilter: (req,file,cb) => {
            // check to see if the mime type is a an image 
            // upload if its an image
            if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
                cb(null, true)
            }
            // throw error if its not an image
            else{
                cb(null, false)
                cb(new Error('file type unsupported'))
            }
        
            console.log(file)
        }})


    }   

  

}

module.exports = FileUploads 