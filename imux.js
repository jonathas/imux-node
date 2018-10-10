import * as request from 'request-promise';
import * as fs from 'fs';
import * as mime from 'mime';

/**
 * For iMUX API Version 5.6 / 11.08.2017
 */
class IMux {
    _prepareRequest(form, apiMethod, includeAuth = true, httpMethod = 'POST') {
        let options = {
            method: httpMethod,
            uri: `${this.apiBase}/${apiMethod}`,
            rejectUnauthorized: false,
            json: true
        };

        if (form) {
            options.form = form;
        }

        if (includeAuth) {
            options.headers = {
                Cookie: `imuxlogin=${this.token}`
            };
        }

        return options;
    }

    async login(apiBase, user, password) {
        this.apiBase = apiBase;

        const res = await request(this._prepareRequest({ user, password }, 'login', false));
        this.token = res.token;

        return res;
    }

    async logoff() {
        const res = await request(this._prepareRequest(null, 'logoff'));
        this.token = '';
        return res;
    }

    async getConfigData() {
        const res = await request(this._prepareRequest(null, '', true, 'GET'));
        return res;
    }

    async getCarouselList() {
        const res = await this.getConfigData();
        const carouselObj = res.statusUpdate.carouselList;

        if (Object.keys(carouselObj).length === 0 && carouselObj.constructor === Object) {
            return null;
        }

        return Object.keys(carouselObj).map(key => carouselObj[key]);
    }

    async getCarouselInfo(carouselId) {
        const res = await request(this._prepareRequest(null, `carouselInfo?id=${carouselId}`, true, 'GET'));
        return res;
    }

    /**
     * Allowed only 1 file at a time.
     * This endpoint DOES NOT extract the zip file automatically inside iMux
     */
    uploadFile(carouselId, filePath) {
        return this._upload('carouselUploadFile', carouselId, filePath);
    }

    /**
     * This endpoint extracts the zip file automatically inside iMux
     */
    uploadZipFile(carouselId, filePath, purgeBefore = false) {
        if (mime.getType(filePath) !== 'application/zip') {
            throw new Error('You should send a zip file');
        }
        return this._upload('carouselUploadZip', carouselId, filePath, purgeBefore);
    }

    _upload(method, carouselId, filePath, purgeBefore = false) {
        let options = this._prepareRequest(null, method);

        options.formData = {
            id: carouselId,
            dest: '/',
            overwrite: 'true',
            file: fs.createReadStream(filePath)
        };

        if (purgeBefore) {
            options.formData.remove = 'true';
        }

        return request(options);
    }

    updateCarousel(carouselId, data) {
        const form = { id: carouselId };

        if (data) {
            Object.assign(form, data);
        }

        return request(this._prepareRequest(JSON.stringify(form), 'updateCreateCarousel'));
    }

    deleteFile(carouselId, fileName) {
        const data = {
            id: carouselId,
            path: `/${fileName}`
        };

        return request(this._prepareRequest(data, 'deleteCarouselFile'));
    }

    uploadTS(transportStreamId, filePath) {
        let options = this._prepareRequest(null, 'uploadTS');

        options.formData = {
            id: transportStreamId,
            file: fs.createReadStream(filePath)
        };

        return request(options);
    }

    activate() {
        return request(this._prepareRequest(null, 'activate'));
    }
}

module.exports = new IMux();