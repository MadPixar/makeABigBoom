//format不同文件icon-class
export function formatIconClass(label: string, prefix = "icc-files-") {
  if (!label) return;
  const suffix = label.replace(/.*\./g, "");
  const iconMap: any = {
    jpg: "img",
    png: "img",
    txt: "text",
    doc: "doc",
    docx: "doc",
    zip: "zip",
    rar: "zip",
    xls: "xls",
    xlsx: "xls",
    ppt: "ppt",
    pptx: "ppt",
    pdf: "pdf",
    PDF: "pdf",
    dwg: "dwg",
    mp3: "mp3",
    iso: "iso",
    mp4: "vedio"
  };
  return prefix + (iconMap[suffix] || "unkown");
}
