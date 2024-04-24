let shiftStart = null;

function startShift() {
  shiftStart = new Date();
  console.log('Shift started at:', shiftStart);
}

function endShift() {
  if (!shiftStart) {
    console.error('Please start the shift before ending it.');
    return;
  }

  const shiftEnd = new Date();
  const shiftDuration = shiftEnd - shiftStart;
  console.log('Shift ended at:', shiftEnd);
  console.log('Total shift duration:', shiftDuration, 'ms');
}