import React from 'react';
import './style.css'
import * as Utils from '../utils/utils.js'
import DocumentPreview from './DocumentPreview';
import {Link} from 'react-router-dom'
import CommonServices from '../services/common/common';

import BackBtn from '../images/backBtn.png'

var pdfjsLib = window['pdfjs-dist/build/pdf'];
const Loader = new CommonServices();

class DownloadAndPreview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            filename : null
            //showCss: false
        }
    };

    componentDidMount() {
        let sessiondata = JSON.parse(sessionStorage.getItem("pdfData"));
        this.setState({
            filename    : sessiondata.filename,
            data        : sessiondata.base64file
        })
    };

    downloadPDF = () => {
        //window.open(this.state.url, '_blank');
        var filename    = this.state.filename;
        var base64file  = this.state.data;
        var filebytes   = this.base64ToArrayBuffer(base64file);
        this.saveByteArray(filename,filebytes);
    };

    base64ToArrayBuffer = (base64) => {
        var binaryString = window.atob(base64);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
           var ascii = binaryString.charCodeAt(i);
           bytes[i] = ascii;
        }
        return bytes;
     };

     saveByteArray = (reportName, byte) => {
        var blob = new Blob([byte], {type: "application/pdf"});
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        var fileName = reportName;
        link.download = fileName;
        link.click();
    };

    downloadAndRenderImage = () => {
        Loader.showLoader();
        var loadingTask = pdfjsLib.getDocument({data: atob(this.state.data)});
        loadingTask.promise.then(function (pdf) {
            console.log('PDF loaded');

            // Fetch the first page
            var pageNumber = 1;
            pdf.getPage(pageNumber).then(function (page) {
                console.log('Page loaded');

                var scale = 1.5;
                var viewport = page.getViewport({ scale: scale });

                // Prepare canvas using PDF page dimensions
                var canvas = document.getElementById('the-canvas');
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render PDF page into canvas context
                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                var renderTask = page.render(renderContext);
                renderTask.promise.then(function () {
                    console.log('Page rendered');
                    var imgURL = canvas.toDataURL("image/png");
                    var dlLink = document.createElement('a');
                    dlLink.download = Utils.generateTinyUUID();
                    dlLink.href = imgURL;
                    dlLink.dataset.downloadurl = ["image/png", dlLink.download, dlLink.href].join(':');

                    document.body.appendChild(dlLink);
                    dlLink.click();
                    document.body.removeChild(dlLink);
                    Loader.hideLoader();
                    // this.setState({
                    //     showCss: true
                    // })
                });
            });
        }, function (reason) {
            // PDF loading error
            console.error(reason);
            Loader.hideLoader();
        });
    };


    render() {

        return (
            <React.Fragment>
                    
                    {/* <label>Download and Preview File </label> */}
                <div className="col-6">
                    <ul>
                        <li>
                            <div className="downloadLink">
                                <Link to="/" className="backBtn"><img src={BackBtn} alt="Back"/></Link>
                                <button className="downloadIcon" onClick={this.downloadPDF}>Export as PDF</button>
                            </div>
                        </li>
                        <li>
                            <DocumentPreview url={this.state.url}></DocumentPreview>
                        </li>
                    </ul>
                    </div>
                    <div className="col-6">
                        <div className="canvas-container">

                        <button className="downloadAsImage" onClick={this.downloadAndRenderImage}>Preview & Export as Image</button>
                            <canvas id="the-canvas" className="the-canvas"></canvas>
                        </div>
                    </div>
            </React.Fragment>
        );
    };



}


export default DownloadAndPreview;