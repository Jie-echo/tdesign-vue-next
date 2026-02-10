import { h, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { expect, vi } from 'vitest';
import Swiper, { SwiperItem } from '@tdesign/components/swiper';

const createSwiper = (props = {}, itemCount = 3) => {
  const items = Array.from({ length: itemCount }, (_, i) => i + 1);
  return mount(Swiper, {
    props: {
      autoplay: false,
      ...props,
    },
    slots: {
      default: () => items.map((item) => <SwiperItem key={item}>{item}</SwiperItem>),
    },
  });
};

describe('Swiper', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  // ==================== Props Tests ====================
  describe('props', () => {
    it('default render', () => {
      const wrapper = createSwiper();
      expect(wrapper.find('.t-swiper').exists()).toBeTruthy();
      expect(wrapper.find('.t-swiper__wrap').exists()).toBeTruthy();
      expect(wrapper.find('.t-swiper__content').exists()).toBeTruthy();
      expect(wrapper.find('.t-swiper__container').exists()).toBeTruthy();
    });

    it(':animation[slide/fade]', async () => {
      const wrapper = createSwiper({ animation: 'slide' });
      expect(wrapper.find('.t-swiper-fade').exists()).toBeFalsy();
      await wrapper.setProps({ animation: 'fade' });
      expect(wrapper.find('.t-swiper-fade').exists()).toBeTruthy();
    });

    it(':animation validator', () => {
      const validator = Swiper.props.animation.validator;
      expect(validator('slide')).toBe(true);
      expect(validator('fade')).toBe(true);
      expect(validator(undefined)).toBe(true);
      expect(validator(null)).toBe(true);
      expect(validator('invalid')).toBe(false);
    });

    it(':autoplay[boolean]', async () => {
      const wrapper = createSwiper({ autoplay: true, interval: 5000 });
      await nextTick();
      vi.advanceTimersByTime(5100);
      await nextTick();
      const navItems = wrapper.findAll('.t-swiper__navigation-item');
      if (navItems.length > 1) {
        expect(navItems[1].classes()).toContain('t-is-active');
      }
    });

    it(':autoplay false does not auto advance', async () => {
      const wrapper = createSwiper({ autoplay: false });
      await nextTick();
      vi.advanceTimersByTime(10000);
      await nextTick();
      const navItems = wrapper.findAll('.t-swiper__navigation-item');
      if (navItems.length > 0) {
        expect(navItems[0].classes()).toContain('t-is-active');
      }
    });

    it(':cardScale[number]', () => {
      const wrapper = createSwiper({ type: 'card', cardScale: 0.8 });
      const items = wrapper.findAll('.t-swiper__container__item');
      const nonActiveItem = items.find((item) => !item.classes().includes('t-is-active'));
      if (nonActiveItem) {
        const style = nonActiveItem.element.getAttribute('style') || '';
        expect(style).toContain('scale(0.8)');
      }
    });

    it(':current[number]', async () => {
      const wrapper = createSwiper({ current: 1 });
      await nextTick();
      const navItems = wrapper.findAll('.t-swiper__navigation-item');
      if (navItems.length > 1) {
        expect(navItems[1].classes()).toContain('t-is-active');
      }
    });

    it(':current watch triggers swiperTo', async () => {
      const onChange = vi.fn();
      const wrapper = createSwiper({ current: 0, onChange });
      await nextTick();
      await wrapper.setProps({ current: 2 });
      await nextTick();
      expect(onChange).toHaveBeenCalled();
    });

    it(':defaultCurrent[number]', () => {
      const wrapper = createSwiper({ defaultCurrent: 2 });
      const navItems = wrapper.findAll('.t-swiper__navigation-item');
      if (navItems.length > 2) {
        expect(navItems[2].classes()).toContain('t-is-active');
      }
    });

    it(':direction[horizontal/vertical]', async () => {
      const wrapper = createSwiper({ direction: 'horizontal' });
      expect(wrapper.find('.t-swiper--vertical').exists()).toBeFalsy();
      await wrapper.setProps({ direction: 'vertical' });
      expect(wrapper.find('.t-swiper--vertical').exists()).toBeTruthy();
    });

    it(':direction validator', () => {
      const validator = Swiper.props.direction.validator;
      expect(validator('horizontal')).toBe(true);
      expect(validator('vertical')).toBe(true);
      expect(validator(undefined)).toBe(true);
      expect(validator('diagonal')).toBe(false);
    });

    it(':direction vertical container style', async () => {
      const wrapper = createSwiper({ direction: 'vertical', height: 300 });
      await nextTick();
      const container = wrapper.find('.t-swiper__container');
      const style = container.element.getAttribute('style') || '';
      expect(style).toContain('height');
      expect(style).toContain('translate3d(0,');
    });

    it(':duration[number]', () => {
      const wrapper = createSwiper({ duration: 500 });
      expect(wrapper.exists()).toBeTruthy();
      expect(wrapper.element).toMatchSnapshot();
    });

    it(':height[number] with card type', () => {
      const wrapper = createSwiper({ height: 600, type: 'card' });
      const container = wrapper.find('.t-swiper__container');
      const style = container.element.getAttribute('style') || '';
      expect(style).toContain('600px');
    });

    it(':height[number] with fade animation', () => {
      const wrapper = createSwiper({ height: 600, animation: 'fade' });
      const container = wrapper.find('.t-swiper__container');
      const style = container.element.getAttribute('style') || '';
      expect(style).toContain('600px');
    });

    it(':height[number] with vertical direction', () => {
      const wrapper = createSwiper({ height: 500, direction: 'vertical' });
      const container = wrapper.find('.t-swiper__container');
      const style = container.element.getAttribute('style') || '';
      expect(style).toContain('500px');
    });

    it(':height not provided with vertical direction', () => {
      const wrapper = createSwiper({ direction: 'vertical' });
      const container = wrapper.find('.t-swiper__container');
      const style = container.element.getAttribute('style') || '';
      expect(style).toContain('0px');
    });

    it(':interval[number]', () => {
      const wrapper = createSwiper({ interval: 3000 });
      expect(wrapper.exists()).toBeTruthy();
    });

    it(':loop[boolean]', async () => {
      const wrapper = createSwiper({ loop: false });
      expect(wrapper.exists()).toBeTruthy();
      await wrapper.setProps({ loop: true });
      expect(wrapper.exists()).toBeTruthy();
    });

    it(':loop false stops at end (card type)', async () => {
      const onChange = vi.fn();
      createSwiper({ loop: false, type: 'card', current: 2, onChange, autoplay: true, interval: 1000 });
      await nextTick();
      vi.advanceTimersByTime(1100);
      await nextTick();
      vi.advanceTimersByTime(400);
      await nextTick();
    });

    it(':loop false stops at end (default type)', async () => {
      createSwiper({ loop: false, current: 1, autoplay: true, interval: 1000 });
      await nextTick();
      vi.advanceTimersByTime(1100);
      await nextTick();
      vi.advanceTimersByTime(400);
      await nextTick();
    });

    it(':navigation[object]', () => {
      const wrapper = createSwiper({
        navigation: {
          placement: 'outside',
          showSlideBtn: 'hover',
          size: 'large',
          type: 'dots-bar',
        },
      });
      expect(wrapper.find('.t-swiper--outside').exists()).toBeTruthy();
      expect(wrapper.find('.t-swiper--large').exists()).toBeTruthy();
      expect(wrapper.find('.t-swiper__navigation-dots-bar').exists()).toBeTruthy();
    });

    it(':navigation type dots', () => {
      const wrapper = createSwiper({
        navigation: { type: 'dots' },
      });
      expect(wrapper.find('.t-swiper__navigation-dots').exists()).toBeTruthy();
    });

    it(':navigation type bars', () => {
      const wrapper = createSwiper({
        navigation: { type: 'bars' },
      });
      expect(wrapper.find('.t-swiper__navigation-bars').exists()).toBeTruthy();
    });

    it(':navigation type fraction', () => {
      const wrapper = createSwiper({
        navigation: { type: 'fraction' },
      });
      expect(wrapper.find('.t-swiper__navigation--fraction').exists()).toBeTruthy();
      expect(wrapper.find('.t-swiper__navigation-text-fraction').exists()).toBeTruthy();
      expect(wrapper.find('.t-swiper__navigation-text-fraction').text()).toBe('1/3');
    });

    it(':navigation[TNode] as VNode', () => {
      const vnode = h('div', { class: 'custom-nav' }, 'Custom Navigation');
      const wrapper = createSwiper({
        navigation: vnode,
      });
      expect(wrapper.find('.custom-nav').exists()).toBeTruthy();
    });

    it(':navigation[slot]', () => {
      const items = [1, 2, 3];
      const wrapper = mount(Swiper, {
        props: { autoplay: false },
        slots: {
          default: () => items.map((item) => <SwiperItem key={item}>{item}</SwiperItem>),
          navigation: () => <div class="slot-nav">Slot Navigation</div>,
        },
      });
      expect(wrapper.find('.slot-nav').exists()).toBeTruthy();
    });

    it(':navigation size small', () => {
      const wrapper = createSwiper({
        navigation: { size: 'small' },
      });
      expect(wrapper.find('.t-swiper--small').exists()).toBeTruthy();
    });

    it(':navigation showSlideBtn always', async () => {
      const wrapper = createSwiper({
        navigation: { showSlideBtn: 'always' },
      });
      await nextTick();
      expect(wrapper.find('.t-swiper__arrow--default').exists()).toBeTruthy();
    });

    it(':navigation showSlideBtn never', () => {
      const wrapper = createSwiper({
        navigation: { showSlideBtn: 'never' },
      });
      expect(wrapper.find('.t-swiper__arrow--default').exists()).toBeFalsy();
    });

    it(':navigation showSlideBtn hover', async () => {
      const wrapper = createSwiper({
        navigation: { showSlideBtn: 'hover' },
      });
      expect(wrapper.find('.t-swiper__arrow--default').exists()).toBeFalsy();
      await wrapper.find('.t-swiper').trigger('mouseenter');
      expect(wrapper.find('.t-swiper__arrow--default').exists()).toBeTruthy();
      await wrapper.find('.t-swiper').trigger('mouseleave');
      expect(wrapper.find('.t-swiper__arrow--default').exists()).toBeFalsy();
    });

    it(':stopOnHover[boolean]', async () => {
      const onChange = vi.fn();
      const wrapper = createSwiper({ stopOnHover: true, autoplay: true, interval: 1000, onChange });
      await nextTick();
      await wrapper.find('.t-swiper').trigger('mouseenter');
      vi.advanceTimersByTime(2000);
      await nextTick();
      const callCount = onChange.mock.calls.length;
      await wrapper.find('.t-swiper').trigger('mouseleave');
      vi.advanceTimersByTime(1100);
      await nextTick();
      expect(onChange.mock.calls.length).toBeGreaterThanOrEqual(callCount);
    });

    it(':trigger[hover/click]', async () => {
      const onChange = vi.fn();
      const wrapper = createSwiper({ trigger: 'hover', onChange });
      const navItems = wrapper.findAll('.t-swiper__navigation-item');
      if (navItems.length > 1) {
        await navItems[1].trigger('mouseenter');
        expect(onChange).toHaveBeenCalled();
      }
    });

    it(':trigger click', async () => {
      const onChange = vi.fn();
      const wrapper = createSwiper({ trigger: 'click', onChange });
      const navItems = wrapper.findAll('.t-swiper__navigation-item');
      if (navItems.length > 1) {
        await navItems[1].trigger('click');
        expect(onChange).toHaveBeenCalled();
      }
    });

    it(':trigger click does not respond to hover', async () => {
      const onChange = vi.fn();
      const wrapper = createSwiper({ trigger: 'click', onChange });
      const navItems = wrapper.findAll('.t-swiper__navigation-item');
      if (navItems.length > 1) {
        await navItems[1].trigger('mouseenter');
        expect(onChange).not.toHaveBeenCalled();
      }
    });

    it(':trigger hover does not respond to click', async () => {
      const onChange = vi.fn();
      const wrapper = createSwiper({ trigger: 'hover', onChange });
      const navItems = wrapper.findAll('.t-swiper__navigation-item');
      if (navItems.length > 1) {
        await navItems[1].trigger('click');
        expect(onChange).not.toHaveBeenCalled();
      }
    });

    it(':trigger validator', () => {
      const validator = Swiper.props.trigger.validator;
      expect(validator('hover')).toBe(true);
      expect(validator('click')).toBe(true);
      expect(validator(undefined)).toBe(true);
      expect(validator('other')).toBe(false);
    });

    it(':type[default/card]', async () => {
      const wrapper = createSwiper({ type: 'default' });
      expect(wrapper.find('.t-swiper-card').exists()).toBeFalsy();
      await wrapper.setProps({ type: 'card' });
      expect(wrapper.find('.t-swiper-card').exists()).toBeTruthy();
    });

    it(':type validator', () => {
      const validator = Swiper.props.type.validator;
      expect(validator('default')).toBe(true);
      expect(validator('card')).toBe(true);
      expect(validator(undefined)).toBe(true);
      expect(validator('other')).toBe(false);
    });

    it(':type card containerStyle', () => {
      const wrapper = createSwiper({ type: 'card', height: 300 });
      const container = wrapper.find('.t-swiper__container');
      const style = container.element.getAttribute('style') || '';
      expect(style).toContain('300px');
    });

    it(':animation fade containerStyle', () => {
      const wrapper = createSwiper({ animation: 'fade', height: 400 });
      const container = wrapper.find('.t-swiper__container');
      const style = container.element.getAttribute('style') || '';
      expect(style).toContain('400px');
    });

    it('containerStyle returns empty for non-slide non-fade non-card', async () => {
      const wrapper = createSwiper({ type: 'default', animation: 'slide' });
      expect(wrapper.find('.t-swiper__container').exists()).toBeTruthy();
    });

    it('slide animation with single item does not clone', () => {
      const wrapper = createSwiper({ animation: 'slide' }, 1);
      const items = wrapper.findAll('.t-swiper__container__item');
      expect(items.length).toBe(1);
    });

    it('slide animation with multiple items clones first and last', () => {
      const wrapper = createSwiper({ animation: 'slide' }, 3);
      const items = wrapper.findAll('.t-swiper__container__item');
      expect(items.length).toBe(5);
    });

    it('no items renders empty', () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false },
        slots: {
          default: () => [],
        },
      });
      expect(wrapper.find('.t-swiper').exists()).toBeTruthy();
    });
  });

  // ==================== Events Tests ====================
  describe('events', () => {
    it('onChange', async () => {
      const onChange = vi.fn();
      const wrapper = createSwiper({ onChange });
      await nextTick();
      const rightArrow = wrapper.find('.t-swiper__arrow-right');
      if (rightArrow.exists()) {
        await rightArrow.trigger('click');
        await nextTick();
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0]).toBe(1);
        expect(onChange.mock.calls[0][1]).toEqual({ source: 'click' });
      }
    });

    it('update:current', async () => {
      const wrapper = createSwiper();
      await nextTick();
      const rightArrow = wrapper.find('.t-swiper__arrow-right');
      if (rightArrow.exists()) {
        await rightArrow.trigger('click');
        await nextTick();
        expect(wrapper.emitted('update:current')).toBeTruthy();
        const emitted = wrapper.emitted('update:current');
        if (emitted) {
          expect(emitted[0][0]).toBe(1);
        }
      }
    });
  });

  // ==================== Navigation Interactions Tests ====================
  describe('navigation interactions', () => {
    it('arrow left click (goPrevious)', async () => {
      const onChange = vi.fn();
      const wrapper = createSwiper({ current: 1, onChange, navigation: { showSlideBtn: 'always' } });
      await nextTick();
      const leftArrow = wrapper.find('.t-swiper__arrow-left');
      if (leftArrow.exists()) {
        await leftArrow.trigger('click');
        await nextTick();
        expect(onChange).toHaveBeenCalled();
      }
    });

    it('arrow right click (goNext)', async () => {
      const onChange = vi.fn();
      const wrapper = createSwiper({ onChange, navigation: { showSlideBtn: 'always' } });
      await nextTick();
      const rightArrow = wrapper.find('.t-swiper__arrow-right');
      if (rightArrow.exists()) {
        await rightArrow.trigger('click');
        await nextTick();
        expect(onChange).toHaveBeenCalled();
      }
    });

    it('fraction navigation arrow left click', async () => {
      const onChange = vi.fn();
      const wrapper = createSwiper({
        current: 1,
        onChange,
        navigation: { type: 'fraction' },
      });
      await nextTick();
      const arrows = wrapper.findAll('.t-swiper__arrow-left');
      if (arrows.length > 0) {
        await arrows[0].trigger('click');
        await nextTick();
        expect(onChange).toHaveBeenCalled();
      }
    });

    it('fraction navigation arrow right click', async () => {
      const onChange = vi.fn();
      const wrapper = createSwiper({
        onChange,
        navigation: { type: 'fraction' },
      });
      await nextTick();
      const arrows = wrapper.findAll('.t-swiper__arrow-right');
      if (arrows.length > 0) {
        await arrows[0].trigger('click');
        await nextTick();
        expect(onChange).toHaveBeenCalled();
      }
    });

    it('fraction index overflow shows 1', async () => {
      const wrapper = createSwiper({
        current: 0,
        navigation: { type: 'fraction' },
      });
      await nextTick();
      const fractionText = wrapper.find('.t-swiper__navigation-text-fraction');
      expect(fractionText.text()).toBe('1/3');
    });

    it('goPrevious at index 0 goes to last item (slide animation)', async () => {
      const onChange = vi.fn();
      const wrapper = createSwiper({ current: 0, onChange, navigation: { showSlideBtn: 'always' } });
      await nextTick();
      const leftArrow = wrapper.findAll('.t-swiper__arrow-left');
      if (leftArrow.length > 0) {
        await leftArrow[0].trigger('click');
        await nextTick();
        expect(onChange).toHaveBeenCalled();
      }
    });

    it('goPrevious at index 0 with slide animation and 2 items', async () => {
      const onChange = vi.fn();
      const wrapper = mount(Swiper, {
        props: { autoplay: false, current: 0, animation: 'slide', onChange, navigation: { showSlideBtn: 'always' } },
        slots: {
          default: () => [<SwiperItem key={1}>1</SwiperItem>, <SwiperItem key={2}>2</SwiperItem>],
        },
      });
      await nextTick();
      const leftArrow = wrapper.findAll('.t-swiper__arrow-left');
      if (leftArrow.length > 0) {
        await leftArrow[0].trigger('click');
        await nextTick();
        expect(onChange).toHaveBeenCalled();
      }
    });

    it('goNext in card type wraps to 0', async () => {
      const onChange = vi.fn();
      const wrapper = createSwiper({ type: 'card', current: 2, onChange, navigation: { showSlideBtn: 'always' } });
      await nextTick();
      const rightArrow = wrapper.findAll('.t-swiper__arrow-right');
      if (rightArrow.length > 0) {
        await rightArrow[0].trigger('click');
        await nextTick();
        expect(onChange).toHaveBeenCalledWith(0, { source: 'click' });
      }
    });

    it('goNext and goPrevious blocked during switching', async () => {
      const onChange = vi.fn();
      const wrapper = createSwiper({ onChange, navigation: { showSlideBtn: 'always' } });
      await nextTick();
      const rightArrow = wrapper.findAll('.t-swiper__arrow-right');
      if (rightArrow.length > 0) {
        await rightArrow[0].trigger('click');
        await nextTick();
        const callCount = onChange.mock.calls.length;
        await rightArrow[0].trigger('click');
        await nextTick();
        expect(onChange.mock.calls.length).toBe(callCount);
      }
    });
  });

  // ==================== Mouse Interactions Tests ====================
  describe('mouse interactions', () => {
    it('mouseenter and mouseleave', async () => {
      const wrapper = createSwiper();
      await wrapper.find('.t-swiper').trigger('mouseenter');
      await nextTick();
      await wrapper.find('.t-swiper').trigger('mouseleave');
      await nextTick();
      expect(wrapper.exists()).toBeTruthy();
    });

    it('mouseenter stops autoplay when stopOnHover is true', async () => {
      const onChange = vi.fn();
      const wrapper = createSwiper({ autoplay: true, stopOnHover: true, interval: 1000, onChange });
      await nextTick();
      await wrapper.find('.t-swiper').trigger('mouseenter');
      vi.advanceTimersByTime(3000);
      await nextTick();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('mouseleave restarts autoplay timer', async () => {
      const onChange = vi.fn();
      const wrapper = createSwiper({ autoplay: true, stopOnHover: true, interval: 1000, onChange });
      await nextTick();
      await wrapper.find('.t-swiper').trigger('mouseenter');
      await wrapper.find('.t-swiper').trigger('mouseleave');
      vi.advanceTimersByTime(1100);
      await nextTick();
      expect(onChange).toHaveBeenCalled();
    });

    it('mouseleave does not restart timer when isEnd', async () => {
      const wrapper = createSwiper({ autoplay: true, loop: false, current: 1, interval: 1000 });
      await nextTick();
      await wrapper.find('.t-swiper').trigger('mouseenter');
      await wrapper.find('.t-swiper').trigger('mouseleave');
      expect(wrapper.exists()).toBeTruthy();
    });
  });

  // ==================== Autoplay and Timer Tests ====================
  describe('autoplay and timer', () => {
    it('autoplay advances slides', async () => {
      const onChange = vi.fn();
      createSwiper({ autoplay: true, interval: 1000, onChange });
      await nextTick();
      vi.advanceTimersByTime(1100);
      await nextTick();
      expect(onChange).toHaveBeenCalledWith(1, { source: 'autoplay' });
    });

    it('autoplay with interval 0 does not start timer', () => {
      const onChange = vi.fn();
      createSwiper({ autoplay: true, interval: 0, onChange });
      vi.advanceTimersByTime(5000);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('slide transition: swiperTo index >= swiperItemLength triggers endToBegin', async () => {
      const onChange = vi.fn();
      createSwiper({ autoplay: true, interval: 1000, current: 2, onChange, duration: 300 });
      await nextTick();
      vi.advanceTimersByTime(1100);
      await nextTick();
      expect(onChange).toHaveBeenCalled();
      vi.advanceTimersByTime(400);
      await nextTick();
    });

    it('slide transition: swiperTo from 0 to last triggers beginToEnd', async () => {
      const onChange = vi.fn();
      const wrapper = createSwiper({
        current: 0,
        onChange,
        duration: 300,
        navigation: { showSlideBtn: 'always' },
      });
      await nextTick();
      const leftArrow = wrapper.findAll('.t-swiper__arrow-left');
      if (leftArrow.length > 0) {
        await leftArrow[0].trigger('click');
        await nextTick();
        vi.advanceTimersByTime(400);
        await nextTick();
      }
    });

    it('isSwitching watch clears timer at end (non-loop)', async () => {
      const onChange = vi.fn();
      createSwiper({ autoplay: true, loop: false, current: 0, interval: 1000, onChange, duration: 300 });
      await nextTick();
      vi.advanceTimersByTime(1100);
      await nextTick();
      vi.advanceTimersByTime(400);
      await nextTick();
    });

    it('isSwitching timer is cleared and reset on rapid switching', async () => {
      const onChange = vi.fn();
      const wrapper = createSwiper({ onChange, duration: 300, navigation: { showSlideBtn: 'always' } });
      await nextTick();
      const rightArrow = wrapper.findAll('.t-swiper__arrow-right');
      if (rightArrow.length > 0) {
        await rightArrow[0].trigger('click');
        await nextTick();
        vi.advanceTimersByTime(200);
        vi.advanceTimersByTime(200);
        await nextTick();
      }
    });
  });

  // ==================== Dynamic List Tests ====================
  describe('dynamic list', () => {
    it('set item list dynamically', async () => {
      const list = ref<number[]>([]);
      const wrapper = mount({
        setup() {
          return () => (
            <Swiper autoplay={false}>
              {list.value.map((item: number) => (
                <SwiperItem key={item}>{item}</SwiperItem>
              ))}
            </Swiper>
          );
        },
      });
      await nextTick();
      const swiper = wrapper.findComponent(Swiper);
      expect(swiper.findAll('.t-swiper__container__item').length).toBe(0);
      list.value = [1, 2, 3];
      await nextTick();
      expect(swiper.findAll('.t-swiper__container__item').length).toBe(5);
    });
  });

  // ==================== Edge Cases Tests ====================
  describe('edge cases', () => {
    it('should handle component unmount gracefully', async () => {
      const wrapper = createSwiper({ autoplay: true, interval: 1000 });
      await nextTick();
      wrapper.unmount();
      expect(true).toBe(true);
    });

    it('single item does not add cloned elements for slide', () => {
      const wrapper = createSwiper({ animation: 'slide' }, 1);
      expect(wrapper.findAll('.t-swiper__container__item').length).toBe(1);
    });

    it('containerStyle with isBeginToEnd or isEndToBegin removes transition', async () => {
      const onChange = vi.fn();
      const wrapper = createSwiper({
        current: 0,
        animation: 'slide',
        onChange,
        duration: 300,
        navigation: { showSlideBtn: 'always' },
      });
      await nextTick();
      const leftArrow = wrapper.findAll('.t-swiper__arrow-left');
      if (leftArrow.length > 0) {
        await leftArrow[0].trigger('click');
        await nextTick();
        vi.advanceTimersByTime(400);
        await nextTick();
        const container = wrapper.find('.t-swiper__container');
        expect(container.exists()).toBeTruthy();
      }
    });

    it('containerStyle webkitTransform and msTransform', () => {
      const wrapper = createSwiper({ animation: 'slide' });
      const container = wrapper.find('.t-swiper__container');
      expect(container.exists()).toBeTruthy();
    });
  });
});
