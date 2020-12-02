/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockableDocumentQuery {
    public async exec(): Promise<any> {
        return null;
    }
}

export class MockableModel {
    public findOne(spec: any): any {
        return null;
    }
}