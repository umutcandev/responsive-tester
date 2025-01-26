"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useRef, useEffect } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Smartphone, Tablet, Monitor, RotateCw, Ruler, Plus, Laptop } from "lucide-react"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"
import { registerServiceWorker } from './register-sw'
import { PWAInstallButton } from "@/components/ui/pwa-install-button"

// Önceden tanımlanmış cihaz boyutları
const devicePresets = {
  mobile: [
    { name: "iPhone SE", width: 375, height: 667 },
    { name: "iPhone 14 Pro", width: 393, height: 852 },
    { name: "Samsung Galaxy S21", width: 360, height: 800 },
    { name: "Samsung A51/71", width: 412, height: 914 },
    { name: "Samsung Z Fold (Kapalı)", width: 280, height: 653 },
    { name: "Samsung Z Fold (Açık)", width: 584, height: 853 },
    { name: "Google Pixel 7", width: 412, height: 915 },
    { name: "OnePlus 10 Pro", width: 412, height: 919 },
    { name: "Xiaomi 12", width: 393, height: 851 },
  ],
  tablet: [
    { name: "iPad Mini", width: 768, height: 1024 },
    { name: "iPad Pro 11", width: 834, height: 1194 },
    { name: "iPad Pro 12.9", width: 1024, height: 1366 },
    { name: "Samsung Tab S8", width: 800, height: 1280 },
    { name: "Samsung Tab S8+", width: 1600, height: 2560 },
    { name: "Samsung Tab S8 Ultra", width: 1848, height: 2960 },
    { name: "Lenovo Tab P12 Pro", width: 1600, height: 2560 },
    { name: "Microsoft Surface Pro", width: 1368, height: 912 },
  ],
  desktop: [
    { name: "Laptop (HD)", width: 1366, height: 768 },
    { name: "Laptop (HD+)", width: 1600, height: 900 },
    { name: "Desktop (FHD)", width: 1920, height: 1080 },
    { name: "Desktop (2K)", width: 2560, height: 1440 },
    { name: "iMac 24", width: 4480, height: 2520 },
    { name: "iMac 27", width: 5120, height: 2880 },
    { name: "MacBook Air", width: 2560, height: 1664 },
    { name: "MacBook Pro 16", width: 3456, height: 2234 },
    { name: "Ultrawide", width: 3440, height: 1440 },
  ],
}

export default function Home() {
  const [url, setUrl] = useState("")
  const [testUrl, setTestUrl] = useState("")
  const [dimensions, setDimensions] = useState({ width: 1366, height: 768 })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)
  const [activeAccordion, setActiveAccordion] = useState<string | undefined>()
  const previewRef = useRef<HTMLDivElement>(null)
  const [windowWidth, setWindowWidth] = useState(1200)

  useEffect(() => {
    registerServiceWorker()
  }, [])

  useEffect(() => {
    // İlk render'da window genişliğini ayarla
    setWindowWidth(window.innerWidth)

    // Pencere boyutu değiştiğinde güncelle
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    let finalUrl = url
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = `https://${url}`
    }
    setTestUrl(finalUrl)
    // Simüle edilmiş yükleme durumu
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handlePresetSelect = (width: number, height: number) => {
    setDimensions({ width, height })
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setIframeKey(prev => prev + 1) // iframe'i yeniden yüklemek için key'i değiştir
    setTimeout(() => setIsRefreshing(false), 1000) // 1 saniye sonra dönme animasyonunu durdur
  }

  // Önizleme container'ı için ölçeklendirme hesaplaması
  const calculatePreviewStyles = () => {
    const maxContainerWidth = 1200 // Container'ın maksimum genişliği
    const isMobile = windowWidth < 768 // Mobil görünüm kontrolü
    const mobileMaxWidth = windowWidth - 32 // Mobilde kenarlardan 16px padding
    
    let scale = dimensions.width > maxContainerWidth 
      ? maxContainerWidth / dimensions.width 
      : 1

    // Mobilde ekrana sığacak şekilde ölçeklendir
    if (isMobile && dimensions.width * scale > mobileMaxWidth) {
      scale = mobileMaxWidth / dimensions.width
    }

    return {
      container: {
        width: dimensions.width * scale,
        height: dimensions.height * scale,
        maxWidth: '100%',
        overflow: 'auto',
      },
      header: {
        width: dimensions.width * scale,
        maxWidth: '100%',
      },
      iframe: {
        width: dimensions.width,
        height: dimensions.height,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      },
      scaleInfo: {
        scale: Math.round(scale * 100)
      }
    }
  }

  const previewStyles = calculatePreviewStyles()

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Laptop className="h-5 w-5" />
            <h1 className="text-xl font-semibold">Responsive Tester</h1>
          </Link>
          <div className="flex items-center gap-2">
            <PWAInstallButton />
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-8">
        <div className="space-y-6">
          {/* URL Girişi ve PC'de Özel Boyut */}
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSubmit} className="flex flex-1 gap-4">
              <Input 
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading} className="min-w-[100px]">
                {isLoading ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Gönder
                  </>
                )}
              </Button>
            </form>

            {/* PC'de görünecek özel boyut alanı */}
            <div className="hidden md:flex items-center gap-4 min-w-[320px]">
              <Input
                type="number"
                placeholder="Genişlik"
                value={dimensions.width}
                onChange={(e) => setDimensions(prev => ({ ...prev, width: Number(e.target.value) }))}
                min={320}
                max={3840}
              />
              <span className="text-muted-foreground">×</span>
              <Input
                type="number"
                placeholder="Yükseklik"
                value={dimensions.height}
                onChange={(e) => setDimensions(prev => ({ ...prev, height: Number(e.target.value) }))}
                min={320}
                max={2160}
              />
            </div>
          </div>

          {/* Cihaz Seçenekleri */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mobil Cihazlar */}
            <Accordion 
              type="single" 
              collapsible 
              value={activeAccordion}
              onValueChange={setActiveAccordion}
              className="w-full border border-input rounded-lg"
            >
              <AccordionItem value="mobile" className="border-none">
                <AccordionTrigger className="px-4">
                  <div className="flex gap-2 items-center">
                    <Smartphone className="h-4 w-4 shrink-0" />
                    <span>Mobil Cihazlar</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {devicePresets.mobile.map((device) => (
                      <Button
                        key={device.name}
                        variant="ghost"
                        className="w-full justify-between"
                        onClick={() => handlePresetSelect(device.width, device.height)}
                      >
                        {device.name}
                        <span className="text-xs text-muted-foreground font-mono">
                          {device.width} × {device.height}
                        </span>
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Tablet Cihazlar */}
            <Accordion 
              type="single" 
              collapsible 
              value={activeAccordion}
              onValueChange={setActiveAccordion}
              className="w-full border border-input rounded-lg"
            >
              <AccordionItem value="tablet" className="border-none">
                <AccordionTrigger className="px-4">
                  <div className="flex gap-2 items-center">
                    <Tablet className="h-4 w-4 shrink-0" />
                    <span>Tablet Cihazlar</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {devicePresets.tablet.map((device) => (
                      <Button
                        key={device.name}
                        variant="ghost"
                        className="w-full justify-between"
                        onClick={() => handlePresetSelect(device.width, device.height)}
                      >
                        {device.name}
                        <span className="text-xs text-muted-foreground font-mono">
                          {device.width} × {device.height}
                        </span>
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Masaüstü Cihazlar */}
            <Accordion 
              type="single" 
              collapsible 
              value={activeAccordion}
              onValueChange={setActiveAccordion}
              className="w-full border border-input rounded-lg"
            >
              <AccordionItem value="desktop" className="border-none">
                <AccordionTrigger className="px-4">
                  <div className="flex gap-2 items-center">
                    <Monitor className="h-4 w-4 shrink-0" />
                    <span>Masaüstü Cihazlar</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {devicePresets.desktop.map((device) => (
                      <Button
                        key={device.name}
                        variant="ghost"
                        className="w-full justify-between"
                        onClick={() => handlePresetSelect(device.width, device.height)}
                      >
                        {device.name}
                        <span className="text-xs text-muted-foreground font-mono">
                          {device.width} × {device.height}
                        </span>
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Mobilde görünecek özel boyut alanı */}
            <div className="md:hidden">
              <Accordion 
                type="single" 
                collapsible 
                value={activeAccordion}
                onValueChange={setActiveAccordion}
                className="w-full border border-input rounded-lg"
              >
                <AccordionItem value="custom" className="border-none">
                  <AccordionTrigger className="px-4">
                    <div className="flex gap-2 items-center">
                      <Ruler className="h-4 w-4 shrink-0" />
                      <span>Özel Boyut</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex gap-4 items-center px-4 py-2">
                      <Input
                        type="number"
                        placeholder="Genişlik"
                        value={dimensions.width}
                        onChange={(e) => setDimensions(prev => ({ ...prev, width: Number(e.target.value) }))}
                        min={320}
                        max={3840}
                      />
                      <span className="text-muted-foreground">×</span>
                      <Input
                        type="number"
                        placeholder="Yükseklik"
                        value={dimensions.height}
                        onChange={(e) => setDimensions(prev => ({ ...prev, height: Number(e.target.value) }))}
                        min={320}
                        max={2160}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Önizleme */}
          <div className="flex flex-col items-center">
            <div className="space-y-2 w-full">
              <div 
                style={previewStyles.header}
                className="flex items-center justify-between px-1 mx-auto"
              >
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">Önizleme</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleRefresh}
                    disabled={!testUrl}
                  >
                    <RotateCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground font-mono">
                    {dimensions.width} × {dimensions.height}px
                  </span>
                  <span className="text-xs text-muted-foreground">
                    (%{previewStyles.scaleInfo.scale})
                  </span>
                </div>
              </div>
              <div 
                ref={previewRef}
                style={previewStyles.container}
                className="border rounded-lg overflow-hidden bg-card mx-auto"
              >
                {testUrl ? (
                  <div className="w-full h-full origin-top-left">
                    {isLoading ? (
                      <div className="w-full h-full flex items-center justify-center bg-card">
                        <Spinner className="h-8 w-8" />
                      </div>
                    ) : (
                      <iframe 
                        key={iframeKey}
                        src={testUrl}
                        style={previewStyles.iframe}
                        className="border-0 bg-card"
                      />
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-card">
                    Site adresini girin ve test edin
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
    </div>
    </main>
  )
}
