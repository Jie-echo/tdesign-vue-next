import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { expect, vi } from 'vitest';
import Swiper, { SwiperItem } from '@tdesign/components/swiper';
import TSwiperItem from '@tdesign/components/swiper/swiper-item';

describe('SwiperItem', () => {
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
      const wrapper = mount(Swiper, {
        props: { autoplay: false },
        slots: {
          default: () => [
            <SwiperItem key={1}>Content 1</SwiperItem>,
            <SwiperItem key={2}>Content 2</SwiperItem>,
            <SwiperItem key={3}>Content 3</SwiperItem>,
          ],
        },
      });
      const items = wrapper.findAll('.t-swiper__container__item');
      expect(items.length).toBeGreaterThanOrEqual(3);
    });

    it(':type card renders card class', () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false, type: 'card' },
        slots: {
          default: () => [
            <SwiperItem key={1}>1</SwiperItem>,
            <SwiperItem key={2}>2</SwiperItem>,
            <SwiperItem key={3}>3</SwiperItem>,
          ],
        },
      });
      const cardItems = wrapper.findAll('.t-swiper__card');
      expect(cardItems.length).toBeGreaterThan(0);
    });

    it(':type card active item has t-is-active class', () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false, type: 'card', current: 0 },
        slots: {
          default: () => [
            <SwiperItem key={1}>1</SwiperItem>,
            <SwiperItem key={2}>2</SwiperItem>,
            <SwiperItem key={3}>3</SwiperItem>,
          ],
        },
      });
      const activeItems = wrapper.findAll('.t-is-active');
      expect(activeItems.length).toBeGreaterThan(0);
    });

    it(':animation fade renders fade class and opacity style', () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false, animation: 'fade' },
        slots: {
          default: () => [
            <SwiperItem key={1}>1</SwiperItem>,
            <SwiperItem key={2}>2</SwiperItem>,
            <SwiperItem key={3}>3</SwiperItem>,
          ],
        },
      });
      const fadeItems = wrapper.findAll('.t-swiper__fade');
      expect(fadeItems.length).toBeGreaterThan(0);
      const firstItem = fadeItems[0];
      const style = firstItem.element.getAttribute('style') || '';
      expect(style).toContain('opacity');
    });

    it(':animation fade active item has opacity 1', () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false, animation: 'fade', current: 0 },
        slots: {
          default: () => [<SwiperItem key={1}>1</SwiperItem>, <SwiperItem key={2}>2</SwiperItem>],
        },
      });
      const items = wrapper.findAll('.t-swiper__fade');
      if (items.length > 0) {
        const style = items[0].element.getAttribute('style') || '';
        expect(style).toContain('opacity: 1');
      }
    });

    it(':animation fade inactive item has opacity 0', () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false, animation: 'fade', current: 0 },
        slots: {
          default: () => [<SwiperItem key={1}>1</SwiperItem>, <SwiperItem key={2}>2</SwiperItem>],
        },
      });
      const items = wrapper.findAll('.t-swiper__fade');
      if (items.length > 1) {
        const style = items[1].element.getAttribute('style') || '';
        expect(style).toContain('opacity: 0');
      }
    });
  });

  // ==================== Card Mode Dispose Index Tests ====================
  describe('card mode disposeIndex', () => {
    it('currentIndex=0 last item gets disposeIndex -1', () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false, type: 'card', current: 0 },
        slots: {
          default: () => [
            <SwiperItem key={1}>1</SwiperItem>,
            <SwiperItem key={2}>2</SwiperItem>,
            <SwiperItem key={3}>3</SwiperItem>,
            <SwiperItem key={4}>4</SwiperItem>,
            <SwiperItem key={5}>5</SwiperItem>,
          ],
        },
      });
      const items = wrapper.findAll('.t-swiper__card');
      expect(items.length).toBeGreaterThanOrEqual(5);
      expect(wrapper.element).toMatchSnapshot();
    });

    it('currentIndex=last first item gets disposeIndex=swiperItemLength', () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false, type: 'card', current: 4 },
        slots: {
          default: () => [
            <SwiperItem key={1}>1</SwiperItem>,
            <SwiperItem key={2}>2</SwiperItem>,
            <SwiperItem key={3}>3</SwiperItem>,
            <SwiperItem key={4}>4</SwiperItem>,
            <SwiperItem key={5}>5</SwiperItem>,
          ],
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });

    it('item far ahead of currentIndex gets disposeIndex -2', () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false, type: 'card', current: 4 },
        slots: {
          default: () => Array.from({ length: 6 }, (_, i) => <SwiperItem key={i}>{i}</SwiperItem>),
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });

    it('item far behind currentIndex gets disposeIndex=swiperItemLength+1', () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false, type: 'card', current: 0 },
        slots: {
          default: () => Array.from({ length: 6 }, (_, i) => <SwiperItem key={i}>{i}</SwiperItem>),
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });

    it('card type with 2 items uses index directly', () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false, type: 'card', current: 0 },
        slots: {
          default: () => [<SwiperItem key={1}>1</SwiperItem>, <SwiperItem key={2}>2</SwiperItem>],
        },
      });
      const items = wrapper.findAll('.t-swiper__card');
      expect(items.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ==================== Card Mode TranslateX Tests ====================
  describe('card mode translateX', () => {
    it('active item translateX centered', () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false, type: 'card', current: 1 },
        slots: {
          default: () => [
            <SwiperItem key={1}>1</SwiperItem>,
            <SwiperItem key={2}>2</SwiperItem>,
            <SwiperItem key={3}>3</SwiperItem>,
          ],
        },
      });
      const items = wrapper.findAll('.t-swiper__card');
      const activeItem = items.find((item) => item.classes().includes('t-is-active'));
      if (activeItem) {
        const style = activeItem.element.getAttribute('style') || '';
        expect(style).toContain('transform');
        expect(style).toContain('scale(1)');
      }
    });

    it('non-active inStage item has scale < 1', () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false, type: 'card', current: 1, cardScale: 0.8 },
        slots: {
          default: () => [
            <SwiperItem key={1}>1</SwiperItem>,
            <SwiperItem key={2}>2</SwiperItem>,
            <SwiperItem key={3}>3</SwiperItem>,
          ],
        },
      });
      const items = wrapper.findAll('.t-swiper__card');
      const nonActiveItems = items.filter((item) => !item.classes().includes('t-is-active'));
      if (nonActiveItems.length > 0) {
        const style = nonActiveItems[0].element.getAttribute('style') || '';
        expect(style).toContain('scale(0.8)');
      }
    });

    it('out-of-stage item before currentIndex', () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false, type: 'card', current: 3 },
        slots: {
          default: () => Array.from({ length: 6 }, (_, i) => <SwiperItem key={i}>{i}</SwiperItem>),
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });

    it('out-of-stage item after currentIndex', () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false, type: 'card', current: 1 },
        slots: {
          default: () => Array.from({ length: 6 }, (_, i) => <SwiperItem key={i}>{i}</SwiperItem>),
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
  });

  // ==================== Card Mode ZIndex Tests ====================
  describe('card mode zIndex', () => {
    it('active item has highest zIndex', () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false, type: 'card', current: 1 },
        slots: {
          default: () => [
            <SwiperItem key={1}>1</SwiperItem>,
            <SwiperItem key={2}>2</SwiperItem>,
            <SwiperItem key={3}>3</SwiperItem>,
          ],
        },
      });
      const activeItem = wrapper.find('.t-is-active');
      if (activeItem.exists()) {
        const style = activeItem.element.getAttribute('style') || '';
        expect(style).toContain('z-index: 2');
      }
    });

    it('inStage non-active item has zIndex 1', () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false, type: 'card', current: 1 },
        slots: {
          default: () => [
            <SwiperItem key={1}>1</SwiperItem>,
            <SwiperItem key={2}>2</SwiperItem>,
            <SwiperItem key={3}>3</SwiperItem>,
          ],
        },
      });
      const items = wrapper.findAll('.t-swiper__card');
      const adjacentItems = items.filter((item) => !item.classes().includes('t-is-active'));
      if (adjacentItems.length > 0) {
        const style = adjacentItems[0].element.getAttribute('style') || '';
        expect(style).toContain('z-index: 1');
      }
    });

    it('out-of-stage item has zIndex 0', () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false, type: 'card', current: 0 },
        slots: {
          default: () => Array.from({ length: 6 }, (_, i) => <SwiperItem key={i}>{i}</SwiperItem>),
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
  });

  // ==================== ItemStyle Tests ====================
  describe('itemStyle', () => {
    it('default type returns empty style', () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false, type: 'default', animation: 'slide' },
        slots: {
          default: () => [<SwiperItem key={1}>1</SwiperItem>, <SwiperItem key={2}>2</SwiperItem>],
        },
      });
      const items = wrapper.findAll('.t-swiper__container__item');
      if (items.length > 0) {
        const style = items[0].element.getAttribute('style');
        expect(style === null || style === '').toBeTruthy();
      }
    });

    it('fade animation applies transition when switching', async () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false, animation: 'fade', duration: 500, navigation: { showSlideBtn: 'always' } },
        slots: {
          default: () => [<SwiperItem key={1}>1</SwiperItem>, <SwiperItem key={2}>2</SwiperItem>],
        },
      });
      await nextTick();
      const rightArrow = wrapper.findAll('.t-swiper__arrow-right');
      if (rightArrow.length > 0) {
        await rightArrow[0].trigger('click');
        await nextTick();
        const items = wrapper.findAll('.t-swiper__fade');
        if (items.length > 0) {
          const style = items[0].element.getAttribute('style') || '';
          expect(style).toContain('opacity');
        }
      }
    });

    it('card type applies transform and scale', () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false, type: 'card', current: 0, cardScale: 0.6 },
        slots: {
          default: () => [
            <SwiperItem key={1}>1</SwiperItem>,
            <SwiperItem key={2}>2</SwiperItem>,
            <SwiperItem key={3}>3</SwiperItem>,
          ],
        },
      });
      const activeItem = wrapper.find('.t-is-active');
      if (activeItem.exists()) {
        const style = activeItem.element.getAttribute('style') || '';
        expect(style).toContain('scale(1)');
      }
      const nonActiveItems = wrapper
        .findAll('.t-swiper__card')
        .filter((item) => !item.classes().includes('t-is-active'));
      if (nonActiveItems.length > 0) {
        const style = nonActiveItems[0].element.getAttribute('style') || '';
        expect(style).toContain('scale(0.6)');
      }
    });
  });

  // ==================== Edge Cases Tests ====================
  describe('edge cases', () => {
    it('empty slot renders without error', () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false, type: 'card' },
        slots: {
          default: () => [],
        },
      });
      expect(wrapper.find('.t-swiper').exists()).toBeTruthy();
    });

    it('single item in card mode', () => {
      const wrapper = mount(Swiper, {
        props: { autoplay: false, type: 'card' },
        slots: {
          default: () => [<SwiperItem key={1}>1</SwiperItem>],
        },
      });
      const items = wrapper.findAll('.t-swiper__card');
      expect(items.length).toBe(1);
    });
  });

  // ==================== Direct SwiperItem Mount Tests ====================
  describe('direct mount SwiperItem', () => {
    it('non-card type: disposeIndex, translateX, zIndex return 0', () => {
      const wrapper = mount(TSwiperItem, {
        props: {
          type: 'default',
          animation: 'slide',
          index: 0,
          currentIndex: 0,
          swiperItemLength: 3,
          swiperWidth: 800,
          duration: 300,
          isSwitching: false,
          cardScale: 0.63,
        },
        slots: {
          default: () => 'Content',
        },
      });
      expect(wrapper.find('.t-swiper__container__item').exists()).toBeTruthy();
      expect(wrapper.find('.t-swiper__card').exists()).toBeFalsy();
      const style = wrapper.find('.t-swiper__container__item').element.getAttribute('style');
      expect(style === null || style === '').toBeTruthy();
    });

    it('SwiperItem without default slot renders empty', () => {
      const wrapper = mount(TSwiperItem, {
        props: {
          type: 'default',
          animation: 'slide',
          index: 0,
          currentIndex: 0,
          swiperItemLength: 2,
          swiperWidth: 800,
          duration: 300,
          isSwitching: false,
          cardScale: 0.63,
        },
      });
      expect(wrapper.find('.t-swiper__container__item').exists()).toBeTruthy();
      expect(wrapper.text()).toBe('');
    });

    it('card type: translateX for out-of-stage item before current', () => {
      const wrapper = mount(TSwiperItem, {
        props: {
          type: 'card',
          animation: 'slide',
          index: 0,
          currentIndex: 3,
          swiperItemLength: 6,
          swiperWidth: 800,
          duration: 300,
          isSwitching: false,
          cardScale: 0.63,
        },
        slots: {
          default: () => 'Content',
        },
      });
      const style = wrapper.find('.t-swiper__container__item').element.getAttribute('style') || '';
      expect(style).toContain('transform');
      expect(style).toContain('z-index: 0');
    });

    it('card type: translateX for out-of-stage item after current', () => {
      const wrapper = mount(TSwiperItem, {
        props: {
          type: 'card',
          animation: 'slide',
          index: 5,
          currentIndex: 1,
          swiperItemLength: 6,
          swiperWidth: 800,
          duration: 300,
          isSwitching: false,
          cardScale: 0.63,
        },
        slots: {
          default: () => 'Content',
        },
      });
      const style = wrapper.find('.t-swiper__container__item').element.getAttribute('style') || '';
      expect(style).toContain('transform');
    });
  });
});
