import { TrackQueueItem } from '../trackQueue'
import { TrackQueue } from '../trackQueue'


describe('Test TackQue', () => {
  const queue = new TrackQueue("testid");
  queue.push(sometrack)
  it('should push to queue', () => {
    expect(queue.peek()).toBe(sometrack);
    
  });

  // it('should add tracks and pop in order', () => {})
  // it('should not pop track if peeked', () => {})
})

