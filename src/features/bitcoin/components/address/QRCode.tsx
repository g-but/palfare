'use client'

import { useEffect, useRef } from 'react'
import QRCodeLib from 'qrcode'

interface QRCodeProps {
  address: string
  size?: number
}

export function QRCode({ address, size = 200 }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    QRCodeLib.toCanvas(canvasRef.current, address, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
  }, [address, size])

  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} />
    </div>
  )
} 