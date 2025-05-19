"use client"

import { useEffect, useState } from "react"
import { FileMusicIcon as MusicNote } from "lucide-react"

interface Note {
  id: number
  x: number
  y: number
  size: number
  speed: number
  color: string
  rotation: number
  rotationSpeed: number
}

interface FloatingNotesProps {
  count?: number
}

export default function FloatingNotes({ count = 5 }: FloatingNotesProps) {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    const colors = ["#E76F51", "#2A9D8F", "#E9C46A"]
    const newNotes: Note[] = []

    for (let i = 0; i < count; i++) {
      newNotes.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10,
        speed: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
      })
    }

    setNotes(newNotes)

    const interval = setInterval(() => {
      setNotes((prevNotes) =>
        prevNotes.map((note) => {
          let newY = note.y - note.speed
          if (newY < -10) {
            newY = 110
            note.x = Math.random() * 100
          }
          return {
            ...note,
            y: newY,
            rotation: (note.rotation + note.rotationSpeed) % 360,
          }
        }),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {notes.map((note) => (
        <div
          key={note.id}
          className="absolute"
          style={{
            left: `${note.x}%`,
            top: `${note.y}%`,
            transform: `rotate(${note.rotation}deg)`,
            color: note.color,
            opacity: 0.5,
          }}
        >
          <MusicNote size={note.size} />
        </div>
      ))}
    </div>
  )
}
