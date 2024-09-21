import {useState,useContext} from 'react'
import { useDB } from './DBProvider';
import './UploadImage.css'

export default function UploadImage() {
        const  [selectedImage,setSelectedImage] = useState(null);
        const  [previewURL,setPreviewURL] = useState(null);
        const  [imageID,setImageID] = useState(null);
        const db = useContext(useDB)

        const handleImageChange = (e) =>{
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')){
                        setSelectedImage(file);
                        const imageUrl = URL.createObjectURL(file);
                        setPreviewURL(imageUrl);
                }else{
                        alert("Please select a valid image file");
                }
        }

        const handleUploadImmge = (e) =>{
                if (!selectedImage) {
                        alert("Please select iamge first");
                }else{
                        {/* Pre Process image */}
                        {/* Upload process image into  and put respons to DB*/}
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
                        <button onClick={handleUploadImmge}>Calculate My Nutrition</button>

                </div>
        );
}
