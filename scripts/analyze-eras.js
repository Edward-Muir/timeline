#!/usr/bin/env node

/**
 * Era Analysis Script
 *
 * Analyzes historical event data to determine optimal era boundaries
 * that result in roughly equal card counts per era.
 *
 * Usage: node scripts/analyze-eras.js
 */

const fs = require('fs');
const path = require('path');

const EVENTS_DIR = path.join(__dirname, '../public/events');
const NUM_ERAS = 6;

function loadAllEvents() {
  const events = [];
  const files = fs.readdirSync(EVENTS_DIR).filter(f => f.endsWith('.json') && f !== 'manifest.json');

  for (const file of files) {
    const filePath = path.join(EVENTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileEvents = JSON.parse(content);
    events.push(...fileEvents);
  }

  // Deduplicate by name
  const seen = new Set();
  const unique = [];
  for (const event of events) {
    if (!seen.has(event.name)) {
      seen.add(event.name);
      unique.push(event);
    }
  }

  return unique;
}

function calculateQuantileBoundaries(years, numBins) {
  const sorted = [...years].sort((a, b) => a - b);
  const boundaries = [];

  for (let i = 0; i <= numBins; i++) {
    const index = Math.floor((i / numBins) * (sorted.length - 1));
    boundaries.push(sorted[index]);
  }

  return boundaries;
}

function formatYear(year) {
  if (year < 0) {
    return `${Math.abs(year)} BCE`;
  }
  return `${year} CE`;
}

function formatYearShort(year) {
  if (year <= -10000) return 'Prehistory';
  if (year < 0) return `${Math.abs(year)} BCE`;
  if (year >= 2100) return 'Present';
  return `${year}`;
}

function main() {
  console.log('Loading events...');
  const events = loadAllEvents();
  console.log(`Loaded ${events.length} unique events\n`);

  // Extract years
  const years = events.map(e => e.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  console.log(`Year range: ${formatYear(minYear)} to ${formatYear(maxYear)}\n`);

  // Calculate quantile boundaries for equal distribution
  const boundaries = calculateQuantileBoundaries(years, NUM_ERAS);

  // Historical era definitions with meaningful boundaries
  const HISTORICAL_ERAS = [
    { id: 'prehistory', name: 'Prehistory', startYear: minYear, endYear: -3001 },
    { id: 'ancient', name: 'Ancient', startYear: -3000, endYear: 499 },
    { id: 'medieval', name: 'Medieval', startYear: 500, endYear: 1499 },
    { id: 'earlyModern', name: 'Renaissance', startYear: 1500, endYear: 1759 },
    { id: 'industrial', name: 'Industrial', startYear: 1760, endYear: 1913 },
    { id: 'worldWars', name: 'World Wars', startYear: 1914, endYear: 1945 },
    { id: 'coldWar', name: 'Cold War', startYear: 1946, endYear: 1991 },
    { id: 'modern', name: 'Modern', startYear: 1992, endYear: 2100 }
  ];

  console.log('=== HISTORICAL ERA BOUNDARIES ===\n');

  const eraDefinitions = [];

  for (const era of HISTORICAL_ERAS) {
    const count = events.filter(e => e.year >= era.startYear && e.year <= era.endYear).length;

    const startDisplay = formatYearShort(era.startYear);
    const endDisplay = formatYearShort(era.endYear);

    console.log(`${era.name}: ${startDisplay} to ${endDisplay}`);
    console.log(`  Cards: ${count}`);
    console.log('');

    eraDefinitions.push({
      ...era,
      count
    });
  }

  // Also show quantile boundaries for comparison
  console.log('=== QUANTILE BOUNDARIES (for reference) ===\n');
  for (let i = 0; i < NUM_ERAS; i++) {
    const startYear = i === 0 ? minYear : boundaries[i];
    const endYear = i === NUM_ERAS - 1 ? 2100 : boundaries[i + 1] - 1;
    const count = events.filter(e => e.year >= startYear && e.year <= endYear).length;
    console.log(`Era ${i + 1}: ${formatYearShort(startYear)} to ${formatYearShort(endYear)} (${count} cards)`);
  }

  // Output TypeScript constant
  console.log('\n=== TYPESCRIPT DEFINITION ===\n');
  console.log('Copy this to src/utils/eras.ts:\n');
  console.log(`import { Era, EraDefinition } from '../types';

export const ERA_DEFINITIONS: EraDefinition[] = [`);
  for (const era of eraDefinitions) {
    console.log(`  { id: '${era.id}', name: '${era.name}', startYear: ${era.startYear}, endYear: ${era.endYear} },`);
  }
  console.log(`];

export const ALL_ERAS: Era[] = [${eraDefinitions.map(e => `'${e.id}'`).join(', ')}];`);

  // Summary
  console.log('\n=== SUMMARY ===\n');
  console.log(`Total events: ${events.length}`);
  console.log(`Events per era (target): ${Math.round(events.length / NUM_ERAS)}`);
  console.log(`Actual distribution: ${eraDefinitions.map(e => e.count).join(', ')}`);
}

main();
