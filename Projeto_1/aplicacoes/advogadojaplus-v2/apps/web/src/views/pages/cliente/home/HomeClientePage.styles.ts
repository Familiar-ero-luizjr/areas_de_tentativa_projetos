import styled from "styled-components";

export const PageSection = styled.div`
  min-height: 100dvh;
  padding-bottom: 78px;
  background: var(--aj-color-background);

  .homeHeader {
    position: sticky;
    z-index: 12;
    top: 0;
    display: grid;
    min-height: 62px;
    grid-template-columns: 42px 1fr auto;
    align-items: center;
    gap: 10px;
    padding: 8px 14px;
    background: var(--aj-color-primary);
    color: #fff;
    box-shadow: 0 4px 14px rgba(16,35,63,.18);
  }
  .homeHeader button { border: 0; background: transparent; color: inherit; }
  .homeMenu { display: grid; width: 40px; height: 40px; place-items: center; border-radius: 10px; }
  .homeBrand { display: flex; align-items: center; gap: 8px; font-size: 16px; letter-spacing: -.02em; }
  .homeBrand img { width: 27px; height: 27px; }
  .notif { position: relative; display: grid; width: 42px; height: 42px; place-items: center; }
  .notif span {
    position: absolute;
    top: 2px;
    right: 0;
    display: grid;
    min-width: 16px;
    height: 16px;
    place-items: center;
    border-radius: 50%;
    background: var(--aj-color-accent);
    color: #fff;
    font-size: 10px;
    font-weight: 800;
  }

  .homeContent { width: min(100%,720px); margin: 0 auto; padding: 22px 16px 36px; }
  .homeContent .eyebrow { display: block; margin-bottom: 7px; font-size: 10px; }
  .homeContent h1 { margin: 0 0 8px; color: var(--aj-color-primary); font-size: 24px; line-height: 1.15; }
  .lead { margin: 0 0 18px; color: var(--aj-color-muted); font-size: 14px; line-height: 1.5; }

  .filterCard {
    margin-bottom: 18px;
    padding: 17px;
    border: 1px solid var(--aj-color-border);
    border-radius: 16px;
    background: #fff;
  }
  .filterCard h2, .resultsHead h2 { margin: 0; color: var(--aj-color-primary); font-size: 18px; }
  .filterCard > p { margin: 7px 0 0; color: var(--aj-color-muted); font-size: 13px; line-height: 1.5; }
  .filterChoice { display: flex; flex-wrap: wrap; gap: 8px; margin: 18px 0; }
  .filterChoice span { width: 100%; color: var(--aj-color-primary); font-size: 12px; font-weight: 800; }
  .filterChoice button {
    min-height: 42px;
    border: 1px solid var(--aj-color-border);
    border-radius: 10px;
    padding: 9px 14px;
    background: #fff;
    color: var(--aj-color-muted);
    font-size: 12px;
    font-weight: 800;
  }
  .filterChoice button.selected { border-color: var(--aj-color-primary); background: var(--aj-color-primary); color: #fff; }
  .filterActions { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 12px; margin-top: 14px; }
  .filterActions .textLink { padding: 10px; }

  .resultsHead { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
  .resultsHead span { border-radius: 999px; padding: 6px 9px; background: #edf3fa; color: var(--aj-color-primary); font-size: 11px; font-weight: 800; }
  .professionalList { display: grid; gap: 10px; }
  .professional {
    display: grid;
    grid-template-columns: 48px minmax(0,1fr) auto;
    align-items: center;
    gap: 12px;
    min-height: 78px;
    border: 1px solid var(--aj-color-border);
    border-radius: 14px;
    padding: 12px;
    background: #fff;
  }
  .avatar { display: grid; width: 48px; height: 48px; place-items: center; border-radius: 13px; background: #e7f0ff; color: var(--aj-color-primary); font-weight: 900; }
  .professionalCopy { min-width: 0; }
  .professionalCopy strong { color: var(--aj-color-primary); font-size: 14px; }
  .professionalCopy p { margin: 4px 0; color: var(--aj-color-muted); font-size: 11px; }
  .professionalCopy small { display: flex; align-items: center; gap: 3px; color: var(--aj-color-accent); font-size: 11px; font-weight: 800; }
  .professional button { border: 0; background: transparent; color: var(--aj-color-primary); font-size: 12px; font-weight: 800; }

  .bottomNav {
    position: fixed;
    z-index: 10;
    right: 0;
    bottom: 0;
    left: 0;
    display: grid;
    grid-template-columns: repeat(4,1fr);
    border-top: 1px solid var(--aj-color-border);
    background: rgba(255,255,255,.97);
    backdrop-filter: blur(12px);
  }
  .bottomNav button { display: grid; min-height: 64px; place-content: center; justify-items: center; gap: 3px; border: 0; background: transparent; color: #778195; font-size: 10px; font-weight: 800; }
  .bottomNav button.active { background: #f0f5fb; color: var(--aj-color-primary); }
  .drawer { position: fixed; z-index: 40; top: 62px; bottom: 0; left: 0; display: flex; width: min(88vw,360px); flex-direction: column; gap: 6px; padding: 18px 14px; background: linear-gradient(180deg,#10233f,#0a1b32); color: #fff; box-shadow: 12px 0 28px rgba(0,0,0,.28); }
  .drawer button { border: 0; border-radius: 8px; padding: 12px; background: rgba(255,255,255,.08); color: #fff; text-align: left; }
`;
