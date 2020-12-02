
export interface Attachment {
    reference: string;
    attachmentType: AttachmentType;
    displayName: string;
    fileName: string;
    mimeType: string;
    size: number;
}

export enum AttachmentType {
    FullScript  = "full_script",
    Sides = "sides",
    Headshot = "headshot",
    FullBody = "fullbody",
    Image = "image",
    ShowReel = "reel",
    Clip = "clip",
    Slate = "slate",
    Video = "video",
    Document = "document"
}