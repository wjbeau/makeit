/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockableDocumentQuery {
    public async exec(): Promise<any> {
        return null;
    }

    public lean(): any {
        return null;
    }

    public populate(spec: any) {
        return null;
    }

    public sort(spec: any) {
        return null;
    }
}

export class MockableModel {
    public find(spec: any): any {
        return null;
    }

    public findOne(spec: any): any {
        return null;
    }

    public findByIdAndUpdate(id: any, data: any, options: any) {
        return null;
    }

    public create(spec: any): any {
        return null;
    }
}

export class MockableDocument {
    public set(spec: any): any {
        return null;
    }

    public save(): any {
        return null;
    }

    public populate(spec: any) {
        return null;
    }

    public execPopulate(): Promise<any> {
        return null;
    }

    public toObject() {
        return null;
    }
}