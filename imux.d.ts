declare function imux(): imux;

declare namespace imux {

    export interface CarouselFile {
        name: string;
        absname: string;
        type: string;
        size: number;
    }

    export interface Assignment {
        id: number;
        orderId: number;
        regexp: string;
        moduleInfoDescr: string;
        lastupTimestamp: string;
        lastupUid: number;
    }

    export interface CarouselModule {
        id: number;
        moduleId: number;
        vmtlId: number;
        vmctId: number;
        repetitions: number;
        bitrateRatio: number;
        cmpiId: null;
        dsiGroupCompatibility: null;
        dsiGroupInfoDescr: null;
        dsiGroupPrivate: null;
        diiPrivate: null;
        lastupTimestamp: string;
        lastupUId: number;
        assignments: Array<Assignment>;
    }

    export interface CarouselInfo {
        errorCode: string;
        errorData: Object;
        files: Array<CarouselFile>;
        events: Array<Object>;
        links: Array<Object>;
        modules: Array<CarouselModule>;
        syncList: Array<Object>;
        secFile: {
            tssize: number,
            tstime: number
        };
    }

    export interface CarouselOperation {
        errorCode: string;
        carouselDetail?: CarouselInfo;
    }

    export interface CarouselUploadZip {
        errorCode: string;
        errorData: {
            count: number;
        };
    }

    export interface UpdateCreateCarousel {
        errorCode: string;
        return: number;
        carouselDetail: CarouselInfo;
    }

    export interface Login {
        errorCode: string;
        token: string;
        activePerms: string;
        lang: string;
        user: string;
    }

    export interface CarouselItem {
        id: number;
        name: string;
        pidData: number;
        bitspersecData: number;
        carouselid: number;
        componenttagData: number;
        forcedVersion: number;
        pidSEvent?: any;
        componenttagSEvent?: any;
        bitspersecSEventMin: number;
        bitspersecSEventMax: number;
        vctId: number;
        useBitrateRatio: boolean;
        dsidiiCycleMSec: number;
        changedSinceActivation: boolean;
        optimizedSinceActivation: boolean;
        generatedCarouselId: number;
        generatedPidData: number;
        generatedCtagData: number;
        generatedPidSEvent: number;
        generatedCtagSEvent: number;
        addDescr?: any;
        vatyId: number;
        deleted: number;
        status: string;
        lastupTimestamp: string;
        lastupUId: number;
        multiPidInfo: any[];
    }

    export interface StatusUpdate {
        serviceList: Object;
        aitList: Object;
        appList: Object;
        tsList: Object;
        carouselList: Object;
        userList: Object;
        activePerms: string;
        configIsActive: boolean;
        lastActivationErrors: any[];
    }

    export interface ConfigResponse {
        errorCode: string;
        statusUpdate: StatusUpdate;
        activestate: number;
    }

    export function login(apiBase: string, user: string, password: string): Promise<any>;

    export function logoff(): Promise<any>;

    export function getConfigData(): Promise<ConfigResponse>;

    export function getCarouselList(): Promise<Array<CarouselItem>>;

    export function getCarouselInfo(carouselId: number): Promise<CarouselInfo>

    /**
     * Allowed only 1 file at a time.
     * This endpoint DOES NOT extract the zip file automatically inside iMux
     */
    export function uploadFile(carouselId: number, filePath: string): Promise<CarouselOperation>;

    /**
     * This endpoint extracts the zip file automatically inside iMux
     */
    export function uploadZipFile(carouselId: number, filePath: string, purgeBefore: boolean = false): Promise<CarouselUploadZip>;

    export function updateCarousel(carouselId: number, data: Object): Promise<UpdateCreateCarousel>;

    export function deleteFile(carouselId: number, fileName: string): Promise<CarouselOperation>;

    export function uploadTS(transportStreamId: number, filePath: string): Promise<{ errorCode: string }>;

    export function activate(): Promise<any>;

}

export = imux;
