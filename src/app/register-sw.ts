declare global {
  interface Window {
    workbox: any;
  }
}

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined) {
    const wb = window.workbox
    
    // Add event listeners to handle any of PWA lifecycle events
    wb.addEventListener('installed', (event: Event) => {
      console.log(`Event ${event.type} is triggered.`)
      console.log(event)
    })

    wb.addEventListener('controlling', (event: Event) => {
      console.log(`Event ${event.type} is triggered.`)
      console.log(event)
    })

    wb.addEventListener('activated', (event: Event) => {
      console.log(`Event ${event.type} is triggered.`)
      console.log(event)
    })

    // Register the service worker after event listeners have been added
    wb.register()
  }
} 