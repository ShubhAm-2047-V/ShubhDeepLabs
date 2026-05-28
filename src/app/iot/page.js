"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Cpu, ArrowRight, MessageSquare, Zap,
  FileText, ShieldCheck, BookOpen, Sparkles, Code, Network
} from "lucide-react";

const IOT_PROJECTS = [
  {
    title: "Smart Home Automation System",
    tech: "ESP8266 + Relay Module + Blynk App + C++",
    desc: "Control home appliances remotely over the internet. Features responsive light switches, custom energy indicators, and mobile control triggers.",
    price: "₹4999",
    accent: "#66BB6A",
    tags: ["ESP8266", "Blynk", "Home Automation"],
  },
  {
    title: "Weather Monitoring Station",
    tech: "ESP32 + DHT22 Sensor + BMP280 + ThingSpeak",
    desc: "Logs ambient temperature, humidity, and barometric pressure. Plots charts on ThingSpeak cloud and shows live indicators.",
    price: "₹4999",
    accent: "#42A5F5",
    tags: ["ESP32", "DHT22", "ThingSpeak Cloud"],
  },
  {
    title: "Automated Plant Watering System",
    tech: "Arduino + Soil Moisture Sensor + Water Pump + LCD",
    desc: "Monitors soil moisture levels in real-time. Automatically triggers water pumps when dryness limit is reached and logs details.",
    price: "₹4999",
    accent: "#FFA726",
    tags: ["Arduino", "Sensors", "Water Pump"],
  },
  {
    title: "Smart Parking Slot Identifier",
    tech: "ESP32 + IR Sensors + Firebase + Web Dashboard",
    desc: "Checks vacant parking spaces using IR proximity grids. Updates available counters in real-time on a beautiful React web dashboard.",
    price: "₹6999",
    accent: "#26A69A",
    tags: ["Firebase Sync", "IR Proximity", "Web Panel"],
  },
  {
    title: "IoT Theft Detection Security Alarm",
    tech: "ESP32-CAM + PIR Sensor + Telegram Bot",
    desc: "Senses unauthorized room motions. Automatically captures security snapshot photos and dispatches alerts directly via Telegram.",
    price: "₹6999",
    accent: "#AB47BC",
    tags: ["ESP32-CAM", "PIR Motion", "Telegram API"],
  },
  {
    title: "RFID Attendance Logger",
    tech: "NodeMCU + RC522 RFID Reader + Google Sheets",
    desc: "Scans student keychains. Logs accurate timestamps and ID numbers directly into a dynamic cloud Google Sheet over WiFi.",
    price: "₹6999",
    accent: "#29B6F6",
    tags: ["RFID Reader", "NodeMCU", "Google Sheets"],
  },
  {
    title: "Health Monitoring Smart Band",
    tech: "ESP32 + MAX30102 Pulse Oximeter + OLED + Blynk",
    desc: "Logs dynamic heart rate bpm and SpO2 oxygen metrics. Displays indicators on a wearable OLED screen and dispatches alarm alerts.",
    price: "₹8999",
    accent: "#EF5350",
    tags: ["Pulse Sensor", "OLED Wearable", "Blynk App"],
  },
  {
    title: "GPS Real-time Asset Tracker",
    tech: "ESP32 + Neo-6M GPS Module + SIM800L GSM + Blynk",
    desc: "Parses latitude/longitude coordinates from active satellites. Plots tracks in real-time on standard digital maps and alerts on geofence breaches.",
    price: "₹8999",
    accent: "#EF5350",
    tags: ["Neo-6M GPS", "GSM SIM800L", "Real-time Map"],
  },
];

const OFFERS = [
  {
    emoji: "🔌",
    title: "Full hardware connection diagrams",
    desc: "All IoT orders include custom, detailed Fritzing circuit drawings and wiring schematics for seamless setup.",
    badge: "FREE SCHEMATICS",
    badgeColor: "bg-[#66BB6A]",
  },
  {
    emoji: "⚡",
    title: "Pre-configured cloud setup",
    desc: "Blynk, ThingSpeak, Firebase, or Google Sheets dashboard configurations are pre-mapped for your credentials.",
    badge: "READY TO GO",
    badgeColor: "bg-[#FFA726]",
  },
  {
    emoji: "🖥️",
    title: "Virtual environment & IDE setups",
    desc: "We configure libraries, boards managers, and drivers remotely on your PC via Zoom or AnyDesk.",
    badge: "FREE SETUP",
    badgeColor: "bg-[#AB47BC]",
  },
  {
    emoji: "🎓",
    title: "Complete Viva prep guides",
    desc: "Expected examiner questions regarding controller lifecycles, protocol differences, and pin grids.",
    badge: "STUDY GUIDE",
    badgeColor: "bg-[#42A5F5]",
  },
];

export default function IotPage() {
  const waUrl = `https://wa.me/919028833275?text=${encodeURIComponent("Hello! I'm a student interested in an IoT hardware project with Shubdeep Labs.")}`;

  return (
    <div className="min-h-screen bg-[#FAF6EE] pb-24">

      {/* ── HERO BANNER ── */}
      <section className="relative bg-[#E1F5FE] border-b-4 border-[#2C2C2C] pt-28 pb-16 px-4 sm:px-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-6 left-6 w-3 h-3 rounded-full bg-[#42A5F5] border-2 border-[#2C2C2C]" />
        <div className="absolute bottom-8 right-10 w-4 h-4 rounded-full bg-[#42A5F5] border-2 border-[#2C2C2C]" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-[#2C2C2C] shadow-[3px_3px_0_#2C2C2C] px-4 py-1.5 rounded-xl mb-6 rotate-[-1deg]">
            <Network className="w-4 h-4 text-[#2C2C2C]" />
            <span className="text-xs font-marker font-extrabold text-[#2C2C2C] uppercase tracking-wider">IoT Hardware Tiers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-marker font-black text-[#2C2C2C] leading-tight mb-4">
            IoT & Hardware Projects<br />
            <span className="underline decoration-[#42A5F5] decoration-4">Starting at ₹4999</span>
          </h1>

          <p className="text-base sm:text-lg font-sans font-semibold text-[#5A5A5A] max-w-2xl mx-auto leading-relaxed mb-8">
            Smart automation designs, hardware controller mapping (Arduino/ESP32/Raspberry Pi), sensors integration, and interactive dashboard monitors.
            Wiring Schematics · Source Code · Dissertation Report · Setup guidance — all package-included.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2C2C2C] text-[#B3E5FC] font-marker font-extrabold text-base rounded-xl border-2 border-[#2C2C2C] shadow-[4px_5px_0_#B3E5FC] hover:shadow-[2px_3px_0_#B3E5FC] hover:translate-y-0.5 transition-all cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
              Order IoT Project
            </a>
            <Link
              href="/order?category=IoT"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#2C2C2C] font-marker font-extrabold text-base rounded-xl border-2 border-[#2C2C2C] shadow-[4px_5px_0_#2C2C2C] hover:bg-[#E1F5FE] hover:shadow-[2px_3px_0_#2C2C2C] hover:translate-y-0.5 transition-all cursor-pointer"
            >
              Customise My Project
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SPECIAL OFFERS ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-marker font-extrabold text-[#2C2C2C] inline-block">
            🔥 Exclusive Student Offers
          </h2>
          <p className="mt-2 text-sm font-marker text-[#6A6A6A]">Special benefits designed specifically for IoT & Hardware applicants</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {OFFERS.map((offer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-4 bg-white border-2 border-[#2C2C2C] rounded-2xl p-5 shadow-[3px_4px_0_#2C2C2C] hover:shadow-[5px_6px_0_#2C2C2C] hover:-translate-y-0.5 transition-all"
            >
              <span className="text-3xl shrink-0">{offer.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[9px] font-black text-white px-2 py-0.5 rounded uppercase tracking-wider ${offer.badgeColor}`}>
                    {offer.badge}
                  </span>
                  <h3 className="font-marker font-extrabold text-[#2C2C2C] text-sm">{offer.title}</h3>
                </div>
                <p className="text-xs font-sans text-[#6A6A6A] leading-relaxed">{offer.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PROJECT CATALOGUE ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-marker font-extrabold text-[#2C2C2C]">
            📚 IoT Projects Catalogue
          </h2>
          <p className="mt-2 text-sm font-marker text-[#6A6A6A]">Choose a certified hardware configuration or outline a custom specification</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {IOT_PROJECTS.map((proj, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white border-2 border-[#2C2C2C] rounded-2xl overflow-hidden shadow-[3px_4px_0_#2C2C2C] hover:shadow-[5px_6px_0_#2C2C2C] hover:-translate-y-1 transition-all flex flex-col"
            >
              <div className="h-2 w-full" style={{ backgroundColor: proj.accent }} />

              <div className="p-5 flex flex-col flex-1">
                <div className="flex flex-wrap gap-1 mb-3">
                  {proj.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-marker font-bold bg-[#FAF6EE] border border-[#2C2C2C]/20 text-[#6A6A6A] px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="font-marker font-extrabold text-[#2C2C2C] text-sm leading-tight mb-2">
                  {proj.title}
                </h3>

                <p className="text-[11px] font-marker font-bold text-[#6A6A6A] mb-2">{proj.tech}</p>

                <p className="text-xs font-sans text-[#5A5A5A] leading-relaxed flex-1 mb-4">
                  {proj.desc}
                </p>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#2C2C2C]/10">
                  <span className="font-marker font-extrabold text-[#2C2C2C] text-base">Approx. {proj.price}</span>
                  <a
                    href={`https://wa.me/919028833275?text=${encodeURIComponent(`Hello! I'm a student interested in the "${proj.title}" IoT project. Please share details.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-marker font-bold text-[#2C2C2C] bg-[#E1F5FE] border border-[#2C2C2C] px-2.5 py-1.5 rounded-lg shadow-[1.5px_2px_0_#2C2C2C] hover:bg-[#42A5F5] transition-all cursor-pointer"
                  >
                    Get This <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CUSTOM ORDER SECTION ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8 py-16">
        <div className="bg-[#2C2C2C] rounded-3xl p-8 sm:p-12 border-2 border-[#2C2C2C] shadow-[6px_8px_0_#42A5F5] text-center relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block text-3xl mb-4">🔌</span>
            <h2 className="text-2xl sm:text-3xl font-marker font-extrabold text-[#B3E5FC] mb-3">
              Need a Custom IoT Hardware System?
            </h2>
            <p className="text-sm font-sans text-[#A0A0A0] leading-relaxed max-w-lg mx-auto mb-8">
              We construct custom microcontroller solutions and dashboard links designed precisely around your course parameters.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#42A5F5] text-[#2C2C2C] font-marker font-extrabold text-sm rounded-xl border-2 border-[#2C2C2C] shadow-[3px_4px_0_#2C2C2C] hover:shadow-[5px_6px_0_#2C2C2C] hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <MessageSquare className="w-5 h-5" />
                Discuss on WhatsApp
              </a>
              <Link
                href="/order?category=IoT"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-[#B3E5FC] font-marker font-extrabold text-sm rounded-xl border-2 border-[#42A5F5]/40 hover:border-[#42A5F5] hover:bg-white/5 transition-all cursor-pointer"
              >
                Custom Request Form
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
