import { ToArrPipe } from './to-arr.pipe';

describe('ToArrPipe', () => {
  it('create an instance', () => {
    const pipe = new ToArrPipe();
    expect(pipe).toBeTruthy();
  });
});
