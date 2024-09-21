import {useState,useContext} from 'react'
import { useDB } from './DBProvider';
import './UploadImage.css'
import {analyzeImage} from './analyzeImage'

export default function UploadImage({setUploading}) {
        const  [selectedImage,setSelectedImage] = useState(null);
        const  [previewURL,setPreviewURL] = useState(null);
        const  [imageID,setImageID] = useState(null);
        const  [base64Image,setBase64Image] =useState(null);
        const db = useDB()
        const [fileState,setFileState] = useState(null)
        
        const fileToBase64 = (file) => {
                return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    resolve(reader.result);  // Resolve the promise with the Base64 string
                  };
                  reader.onerror = reject;  // Handle errors
            
                  reader.readAsDataURL(file);  // Read file as Base64 URL
                });
              };

        const handleImageChange = (e) =>{
                const file = e.target.files[0];
                setFileState(file)
                if (file && file.type.startsWith('image/')){
                        if(previewURL){
                                URL.revokeObjectURL(previewURL)
                                setPreviewURL(null)
                        }

                        setSelectedImage(file);
                        {/*TODO: free it when necessary */}
                        const imageUrl = URL.createObjectURL(file);
                        setPreviewURL(imageUrl);
                }else{
                        alert("Please select a valid image file");
                }
        }

         const calculateImage = async(e) =>{
                setUploading(true)
                if (!selectedImage) {
                        alert("Please select iamge first");
                }else{
                        {/* Pre Process image */}
                        
                        {/* Upload process image into  and put respons to DB*/}
                        {/*Convert image to base64 */}
                        if(fileState){
                                const base64Data = await fileToBase64(fileState)
                                const result = await analyzeImage(base64Data) //returns a parsed json
                                //TODO: the id of data is only going to be avablie here
                                const id = await db.addItem(result)
                                console.log("Inserted Data id is "+ id)
                        }
                        setUploading(false)
                }
        }

        return (
                <div className ="image-upload">
                        {/*Image selector */}
                        <label htmlFor="file-upload">Choose an Image</label>
                        <input id ='file-upload' type='file' accept='image/*' onChange={handleImageChange}></input>
                        {/* Image preview */}
                        <div className='iamge-preview'>
                                <img src = {previewURL} alt = "image preview"></img>
                        </div>

                        {/*Upload button*/}
                        <button onClick={calculateImage}>Calculate My Nutrition</button>

                </div>
        );
}
