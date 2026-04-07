import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { navItems } from '@/data/navigation'

function hrefFor(item: string) {
  if (item === 'Blog') return '/blog'
  return `/#${item.toLowerCase()}`
}

/** Soft spring — high damping, moderate stiffness = smooth “butter” without bounce */
const butterSpring = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 36,
  mass: 0.9,
}

const butterEase = [0.22, 1, 0.36, 1] as const

/** Closed pill width — keep in sync with header padding + label + icon */
const MENU_CLOSED_W = 104
const MENU_OPEN_W = 200

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const menuPanelRef = useRef<HTMLDivElement>(null)
  const lockedScrollY = useRef(0)

  /** Lock background scroll without `overflow: hidden` (that hides the scrollbar). */
  useEffect(() => {
    if (!open) return

    lockedScrollY.current = window.scrollY

    const insideMenu = (target: EventTarget | null) =>
      menuPanelRef.current?.contains(target as Node) ?? false

    const onWheel = (e: WheelEvent) => {
      if (!insideMenu(e.target)) e.preventDefault()
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!insideMenu(e.target)) e.preventDefault()
    }

    const onScroll = () => {
      const y = lockedScrollY.current
      if (Math.abs(window.scrollY - y) > 1) {
        window.scrollTo({ top: y, left: 0, behavior: 'auto' })
      }
    }

    document.addEventListener('wheel', onWheel, { passive: false })
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('scroll', onScroll, { capture: true })

    return () => {
      document.removeEventListener('wheel', onWheel)
      document.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('scroll', onScroll, { capture: true })
    }
  }, [open])

  return (
    <>
      <nav className="z-50 border-b border-slate-200 bg-[#F1F1F1]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 lg:px-0">
          {/* Logo */}
          <a href="/">
            <img
              src="/icon.svg"
              className="size-8"
              alt="Logo"
            />
          </a>

          {/* Fixed slot reserves max width; single `motion` animates w/h/radius so nothing fights at end of close. */}
          <div className="relative h-12 w-64 shrink-0">
            <motion.div
              ref={menuPanelRef}
              onClick={() => setOpen((v) => !v)}
              className="absolute top-0 right-0 z-50 cursor-pointer overflow-hidden bg-slate-900 text-slate-100"
              initial={false}
              animate={{
                width: open ? MENU_OPEN_W : MENU_CLOSED_W,
                height: open ? 246 : 46,
                borderRadius: open ? 28 : 24,
              }}
              transition={butterSpring}
              style={{ transformOrigin: '100% 0%' }}
            >
              {/* 🔹 HEADER (never moves) */}
              <div
                className={`flex h-12 items-center justify-end ${
                  open ? 'gap-2.5 px-4' : 'gap-2 px-3.5'
                }`}
              >
                <span className="text-sm tracking-widest">MENU</span>
                {open ? <X size={18} /> : <Menu size={18} />}
              </div>

              {/* 🔹 MENU CONTENT */}
              <AnimatePresence>
                {open && (
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      opacity: {
                        duration: 0.35,
                        ease: butterEase,
                      },
                    }}
                    className="space-y-4 px-6 pt-4 text-lg"
                  >
                    {navItems.map((item, i) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 6, filter: 'blur(2px)' }}
                        transition={{
                          delay: 0.06 + i * 0.035,
                          duration: 0.45,
                          ease: butterEase,
                        }}
                      >
                        <a
                          href={hrefFor(item)}
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpen(false)
                          }}
                          className="block transition hover:translate-x-1 hover:text-slate-300"
                        >
                          {item}
                        </a>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: butterEase }}
            className="fixed inset-0 z-40"
          />
        )}
      </AnimatePresence>
    </>
  )
}
