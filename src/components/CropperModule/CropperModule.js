import React, {Component} from 'react';
import styles from "./CropperModule.css";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css?raw';
import arrow from '../../assets/arrow.svg';
import axios from 'axios';

class CropperModule extends Component {
    state = {
        image: null,
        thumbnail: null,
        filename: null
    };

    hasFileSelected = (event) => {
        this.setState({
            image: event.target.files[0],
            thumbnail: URL.createObjectURL(event.target.files[0]),
            filename: event.target.files[0].name
        })
    };
    hasImgCropped = () => {
        if (this.state.image) {
            this.setState({thumbnail: this.refs.cropper.getCroppedCanvas().toDataURL()})
        }
    };
    hasImgReset = () => {
        if (this.state.image) {
            this.setState({thumbnail: URL.createObjectURL(this.state.image)})
        }
    };
    hasImgRotated = (deg) => {
        this.refs.cropper.rotate(deg)
    };

    hasFileUploaded = () => {
        if (this.state.thumbnail) {
            const formdata = new FormData();
            formdata.append('photo', this.state.image, this.state.image.name);
            axios.post('INSERT_API_URL', formdata, {
                onUploadProgress: progressEvent => {
                    console.log('Upload Progress: ' + Math.round(progressEvent.loaded / progressEvent.total * 100) + '%')
                }
            })
                .then(res => {
                    console.log(res)
                });
            alert('Photo sent')
        } else {
            alert('Please Upload photo')
        }
    };

    render() {
        let uploadInputFilename = null;
        let uploadInputButtonText = "Upload image";
        let imageCropControls = null;
        let rotateInstruction = null;
        let buttonUploadCenter = (
            <button className={styles.buttonUploadCenter} onClick={() => this.fileInput.click()}>Upload image</button>
        );
        if (this.state.image) {
            uploadInputFilename = this.state.filename;
            uploadInputButtonText = "Change image";
            buttonUploadCenter = null;
            imageCropControls = (
                <div>
                    <img onClick={() => this.hasImgRotated(-90)} className={styles.rotateBtnL} src={arrow} alt=""/>
                    <img onClick={() => this.hasImgRotated(90)} className={styles.rotateBtnR} src={arrow} alt=""/>
                    <button className={styles.buttonCrop} onClick={this.hasImgCropped}>Crop image</button>
                    <button className={styles.buttonReset} onClick={this.hasImgReset}>Reset image</button>
                </div>
            );
            rotateInstruction = (<p className={styles.rotateInstruction}>Use mouse wheel to zoom in & out</p>)
        }

        return (
                <div className={styles.content}>
                    <h1 className={styles.title}>Upload a photo</h1>
                    <div className={styles.uploadInput}>
                        <input
                            style={{display: 'none'}}
                            accept="image/*"
                            type="file"
                            onChange={this.hasFileSelected}
                            ref={fileInput => this.fileInput = fileInput}
                        />
                        <p className={styles.uploadInputFilename}>{uploadInputFilename}</p>
                        <button className={styles.uploadInputButton} onClick={() => this.fileInput.click()}>{uploadInputButtonText}</button>
                    </div>
                    <div className={styles.uploadPhotoCrop}>
                        {imageCropControls}
                        {buttonUploadCenter}
                        <Cropper
                            ref='cropper'
                            src={this.state.thumbnail}
                            style={{height: 330, width: 460}}
                            guides={true}
                            autoCropArea={1}
                            viewMode={0}
                        />
                        {rotateInstruction}
                    </div>
                    <div className={styles.buttons}>
                        <button className={styles.button} onClick={this.hasFileUploaded}>Send image</button>
                    </div>

                </div>
        )
    }
}

export default CropperModule;