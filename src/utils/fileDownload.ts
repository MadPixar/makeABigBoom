import { saveAs } from 'file-saver'
import { AppModule } from "@/store/modules/app";
import { downloadFile } from '@/utils/webViewApi'
import { get } from "./util";
import { fileDownApi } from "@/api/file";



// data auth信息
// params name,fileLinkId,storeId
export const fileDownload = (data: any, params: any) => {
  const {name} = params
  // 平板模式下
  if(AppModule.isTablet){
    const signature = data
    const {fileLinkId,storeId} = params
    downloadFile({
      name,
      fileLinkId,
      url: `api/file/download/file?storeId=${storeId}&fileLinkId=${fileLinkId}`,
      signature,
    })
    return;
  }
  // pc模式下
  return fileDownApi(data,params).then((res: any)=>{
    if(!get(res,'data','')) return;
    saveAs(new Blob([res.data], { type: res.data.type }), decodeURIComponent(name))
  })
}

