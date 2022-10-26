import { Helmet } from 'react-helmet'

const DynamicFontSizeHelmet = typeof window === 'undefined' ? () => <DynamicFontSizeClientHelmet /> : () => null

export default DynamicFontSizeHelmet

export function DynamicFontSizeClientHelmet() {
  return (
    <Helmet
      script={[
        {
          type: 'text/javascript',
          innerHTML: `function setFontSize(){document.getElementsByTagName("html")[0].style.fontSize=Math.round(Math.min(window.innerWidth,window.innerHeight))/100*(15/(1080/100))+'px'}; addEventListener('resize',setFontSize); setFontSize();`,
        },
      ]}
    />
  )
}
