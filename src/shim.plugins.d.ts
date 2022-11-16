// import Vue from 'vue'
import { IglobalProp } from '@/utils/globalprops'

declare module 'vue/types/vue' {
  interface Vue {
    $download(filename: string, data: Blob): void
    $globalProps: IglobalProp
    $openLoading(params?: ILoading): any
    $closeLoading: any
    $toolsFunc: any
    $opener(moduleName: string, ...args: any[]): any
    $toast: any
    $deleteTipText(text: string): any
    $borrow(text?: any): any
    $format: any
  }
}
declare global {
  interface ILoading {
    text: string
  }
  interface Window {
    hunca_mToken_core:AttestationConveyancePreference
  }
}
