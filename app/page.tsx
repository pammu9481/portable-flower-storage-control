"use client";

import { useEffect, useState } from "react";
import {
  Thermometer,
  Droplets,
  Wifi,
  Power,
  Fan,
  Cloud,
  Activity,
  SlidersHorizontal,
  ShieldCheck,
  Cpu,
  Gauge,
} from "lucide-react";

type Sample = {
  time: string;
  temp: number;
  rh: number;
};

const initial: Sample[] = [
  { time: "12:00", temp: 8.4, rh: 88.1 },
  { time: "12:10", temp: 8.1, rh: 88.9 },
  { time: "12:20", temp: 7.8, rh: 89.4 },
  { time: "12:30", temp: 7.6, rh: 90.2 },
  { time: "12:40", temp: 7.4, rh: 90.7 },
  { time: "12:50", temp: 7.3, rh: 91.1 },
];

export default function Home() {
  const [temp, setTemp] = useState(7.3);
  const [rh, setRh] = useState(91.1);

  const [targetT, setTargetT] = useState(8);
  const [targetRH, setTargetRH] = useState(90);

  const [connected, setConnected] = useState(true);
  const [cooling, setCooling] = useState(true);
  const [humidifier, setHumidifier] = useState(false);
  const [fan, setFan] = useState(true);

  const [history, setHistory] = useState<Sample[]>(initial);

  useEffect(() => {
    const id = setInterval(() => {
      setTemp((current) => {
        const next = Math.max(
          5,
          Math.min(12, current + (targetT - current) * 0.08)
        );

        setHistory((old) => [
          ...old.slice(-5),
          {
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            temp: Number(next.toFixed(1)),
            rh,
          },
        ]);

        return Number(next.toFixed(1));
      });

      setRh((current) =>
        Number(
          Math.max(
            70,
            Math.min(98, current + (targetRH - current) * 0.06)
          ).toFixed(1)
        )
      );
    }, 4000);

    return () => clearInterval(id);
  }, [targetT, targetRH, rh]);

  const status = !connected
    ? "Offline"
    : Math.abs(temp - targetT) <= 1 && Math.abs(rh - targetRH) <= 3
    ? "Stable"
    : "Adjusting";

  return (
    <main>
      <header>
        <div>
          <div className="eyebrow">SCEM • MECHANICAL ENGINEERING</div>

          <h1>SMART FLOWER STORAGE BOX</h1>

          <p className="sub">
            ESP32 environmental control & monitoring dashboard
          </p>
        </div>

        <div className="connection">
          <span className={connected ? "dot live" : "dot"}></span>

          {connected ? "ESP32 Connected" : "Offline"}

          <button
            onClick={() => setConnected((value) => !value)}
            className="ghost"
          >
            <Wifi size={16} />
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="tag">LIVE CHAMBER STATUS</div>

          <h2>Controlled environment, visible at a glance.</h2>

          <p>
            Monitor feedback from the GY-SHT30 sensor and send temperature and
            relative-humidity setpoints to the ESP32 control layer.
          </p>

          <div className="hero-meta">
            <span>
              <Cpu size={15} /> ESP32
            </span>

            <span>
              <Activity size={15} /> GY-SHT30
            </span>

            <span>
              <Cloud size={15} /> Web interface
            </span>
          </div>
        </div>

        <div className="hero-status">
          <div className="status-ring">
            <Gauge size={30} />

            <strong>{status}</strong>

            <small>System state</small>
          </div>
        </div>
      </section>

      <section className="grid metrics">
        <article className="card metric">
          <div className="metric-head">
            <span>Chamber Temperature</span>
            <Thermometer />
          </div>

          <div className="value">
            {temp.toFixed(1)}
            <small>°C</small>
          </div>

          <div className="range">
            <div className="bar">
              <span
                style={{
                  width: `${Math.max(
                    8,
                    Math.min(100, ((temp - 5) / 7) * 100)
                  )}%`,
                }}
              />
            </div>

            <span>Target {targetT.toFixed(1)}°C</span>
          </div>
        </article>

        <article className="card metric">
          <div className="metric-head">
            <span>Relative Humidity</span>
            <Droplets />
          </div>

          <div className="value">
            {rh.toFixed(1)}
            <small>%</small>
          </div>

          <div className="range">
            <div className="bar">
              <span style={{ width: `${rh}%` }} />
            </div>

            <span>Target {targetRH}%</span>
          </div>
        </article>

        <article className="card metric">
          <div className="metric-head">
            <span>Cooling Demand</span>
            <Power />
          </div>

          <div className="value">{cooling ? "ON" : "OFF"}</div>

          <div className="minor">
            Dual TEC1-12706 • feedback control
          </div>
        </article>
      </section>

      <section className="grid lower">
        <article className="card chart">
          <div className="title-row">
            <div>
              <span className="kicker">TREND</span>
              <h3>Chamber conditions</h3>
            </div>

            <span className="pill">Last 60 min</span>
          </div>

          <div className="chartbox">
            <div className="ylabels">
              <span>100</span>
              <span>90</span>
              <span>80</span>
              <span>70</span>
            </div>

            <svg
              viewBox="0 0 600 220"
              preserveAspectRatio="none"
            >
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                points={history
                  .map(
                    (sample, index) =>
                      `${20 + index * (560 / Math.max(1, history.length - 1))},${
                        205 - (sample.rh - 70) * 4.1
                      }`
                  )
                  .join(" ")}
              />
            </svg>

            <div className="axis">
              {history.map((sample, index) => (
                <span key={index}>{sample.time}</span>
              ))}
            </div>
          </div>

          <div className="legend">
            <span>
              <i className="swatch"></i> RH
            </span>

            <span>
              Temperature tracked in live cards
            </span>
          </div>
        </article>

        <article className="card control">
          <div className="title-row">
            <div>
              <span className="kicker">CONTROL</span>
              <h3>Setpoints</h3>
            </div>

            <SlidersHorizontal />
          </div>

          <label>
            Temperature target

            <b>{targetT.toFixed(1)}°C</b>

            <input
              type="range"
              min="5"
              max="12"
              step="0.5"
              value={targetT}
              onChange={(event) =>
                setTargetT(Number(event.target.value))
              }
            />

            <div className="range-row">
              <span>5°C</span>
              <span>12°C</span>
            </div>
          </label>

          <label>
            Humidity target

            <b>{targetRH}%</b>

            <input
              type="range"
              min="70"
              max="98"
              step="1"
              value={targetRH}
              onChange={(event) =>
                setTargetRH(Number(event.target.value))
              }
            />

            <div className="range-row">
              <span>70%</span>
              <span>98%</span>
            </div>
          </label>

          <button
            className="apply"
            onClick={() => {
              setCooling(true);
              setHumidifier(targetRH > rh);
            }}
          >
            Apply to ESP32
          </button>
        </article>

        <article className="card devices">
          <div className="title-row">
            <div>
              <span className="kicker">OUTPUTS</span>
              <h3>Actuators</h3>
            </div>

            <ShieldCheck />
          </div>

          <Toggle
            icon={<Power />}
            label="Peltier cooling"
            on={cooling}
            setOn={setCooling}
          />

          <Toggle
            icon={<Droplets />}
            label="Ultrasonic humidifier"
            on={humidifier}
            setOn={setHumidifier}
          />

          <Toggle
            icon={<Fan />}
            label="Air circulation fan"
            on={fan}
            setOn={setFan}
          />

          <div className="note">
            Web controls are ready for ESP32 API/MQTT integration.
            Current prototype values are simulated.
          </div>
        </article>
      </section>

      <footer>
        <span>
          Design basis: portable insulated chamber • 5–10°C target •
          80–95% RH project target
        </span>

        <span>Prototype dashboard</span>
      </footer>
    </main>
  );
}

function Toggle({
  icon,
  label,
  on,
  setOn,
}: {
  icon: React.ReactNode;
  label: string;
  on: boolean;
  setOn: (value: boolean) => void;
}) {
  return (
    <div className="toggle-row">
      <span className="device-label">
        {icon}
        {label}
      </span>

      <button
        className={on ? "switch on" : "switch"}
        onClick={() => setOn(!on)}
      >
        <span></span>
      </button>
    </div>
  );
}
