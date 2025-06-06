import {spy as sinonSpy, stub as sinonStub} from 'sinon';
import Feature from '../../../../../src/ol/Feature.js';
import {VOID} from '../../../../../src/ol/functions.js';
import LineString from '../../../../../src/ol/geom/LineString.js';
import MultiLineString from '../../../../../src/ol/geom/MultiLineString.js';
import MultiPoint from '../../../../../src/ol/geom/MultiPoint.js';
import MultiPolygon from '../../../../../src/ol/geom/MultiPolygon.js';
import Point from '../../../../../src/ol/geom/Point.js';
import Polygon from '../../../../../src/ol/geom/Polygon.js';
import CanvasBuilderGroup from '../../../../../src/ol/render/canvas/BuilderGroup.js';
import {renderFeature} from '../../../../../src/ol/renderer/vector.js';
import Fill from '../../../../../src/ol/style/Fill.js';
import Icon from '../../../../../src/ol/style/Icon.js';
import Stroke from '../../../../../src/ol/style/Stroke.js';
import Style from '../../../../../src/ol/style/Style.js';

describe('ol/renderer/vector', function () {
  describe('#renderFeature', function () {
    let builderGroup;
    let feature, iconStyle, style, squaredTolerance, listener;
    let iconStyleLoadSpy;

    beforeEach(function () {
      builderGroup = new CanvasBuilderGroup(1);
      feature = new Feature();
      iconStyle = new Icon({
        src: 'http://example.com/icon.png',
      });
      style = new Style({
        image: iconStyle,
        fill: new Fill({}),
        stroke: new Stroke({}),
      });
      squaredTolerance = 1;
      listener = function () {};
      iconStyleLoadSpy = sinonStub(iconStyle, 'load').callsFake(function () {
        iconStyle.iconImage_.imageState_ = 1; // LOADING
      });
    });

    afterEach(function () {
      iconStyleLoadSpy.restore();
    });

    describe('call multiple times', function () {
      it('does not set multiple listeners', function () {
        let listeners;

        // call #1
        renderFeature(builderGroup, feature, style, squaredTolerance, listener);

        expect(iconStyleLoadSpy.calledOnce).to.be.ok();
        listeners = iconStyle.iconImage_.listeners_['change'];
        expect(listeners.length).to.eql(1);

        // call #2
        renderFeature(builderGroup, feature, style, squaredTolerance, listener);

        expect(iconStyleLoadSpy.calledOnce).to.be.ok();
        listeners = iconStyle.iconImage_.listeners_['change'];
        expect(listeners.length).to.eql(1);
      });
    });

    describe('call renderFeature with a loading icon', function () {
      it('does not render the point', function () {
        feature.setGeometry(new Point([0, 0]));
        const imageReplay = builderGroup.getBuilder(style.getZIndex(), 'Image');
        const setImageStyleSpy = sinonSpy(imageReplay, 'setImageStyle');
        const drawPointSpy = sinonStub(imageReplay, 'drawPoint').callsFake(
          VOID,
        );
        renderFeature(builderGroup, feature, style, squaredTolerance, listener);
        expect(setImageStyleSpy.called).to.be(false);
        setImageStyleSpy.restore();
        drawPointSpy.restore();
      });

      it('does not render the multipoint', function () {
        feature.setGeometry(
          new MultiPoint([
            [0, 0],
            [1, 1],
          ]),
        );
        const imageReplay = builderGroup.getBuilder(style.getZIndex(), 'Image');
        const setImageStyleSpy = sinonSpy(imageReplay, 'setImageStyle');
        const drawMultiPointSpy = sinonStub(
          imageReplay,
          'drawMultiPoint',
        ).callsFake(VOID);
        renderFeature(builderGroup, feature, style, squaredTolerance, listener);
        expect(setImageStyleSpy.called).to.be(false);
        setImageStyleSpy.restore();
        drawMultiPointSpy.restore();
      });

      it('does render the linestring', function () {
        feature.setGeometry(
          new LineString([
            [0, 0],
            [1, 1],
          ]),
        );
        const lineStringReplay = builderGroup.getBuilder(
          style.getZIndex(),
          'LineString',
        );
        const setFillStrokeStyleSpy = sinonSpy(
          lineStringReplay,
          'setFillStrokeStyle',
        );
        const drawLineStringSpy = sinonStub(
          lineStringReplay,
          'drawLineString',
        ).callsFake(VOID);
        renderFeature(builderGroup, feature, style, squaredTolerance, listener);
        expect(setFillStrokeStyleSpy.called).to.be(true);
        expect(drawLineStringSpy.called).to.be(true);
        setFillStrokeStyleSpy.restore();
        drawLineStringSpy.restore();
      });

      it('does render the multilinestring', function () {
        feature.setGeometry(
          new MultiLineString([
            [
              [0, 0],
              [1, 1],
            ],
          ]),
        );
        const lineStringReplay = builderGroup.getBuilder(
          style.getZIndex(),
          'LineString',
        );
        const setFillStrokeStyleSpy = sinonSpy(
          lineStringReplay,
          'setFillStrokeStyle',
        );
        const drawMultiLineStringSpy = sinonStub(
          lineStringReplay,
          'drawMultiLineString',
        ).callsFake(VOID);
        renderFeature(builderGroup, feature, style, squaredTolerance, listener);
        expect(setFillStrokeStyleSpy.called).to.be(true);
        expect(drawMultiLineStringSpy.called).to.be(true);
        setFillStrokeStyleSpy.restore();
        drawMultiLineStringSpy.restore();
      });

      it('does render the polygon', function () {
        feature.setGeometry(
          new Polygon([
            [
              [0, 0],
              [1, 1],
              [1, 0],
              [0, 0],
            ],
          ]),
        );
        const polygonReplay = builderGroup.getBuilder(
          style.getZIndex(),
          'Polygon',
        );
        const setFillStrokeStyleSpy = sinonSpy(
          polygonReplay,
          'setFillStrokeStyle',
        );
        const drawPolygonSpy = sinonStub(
          polygonReplay,
          'drawPolygon',
        ).callsFake(VOID);
        renderFeature(builderGroup, feature, style, squaredTolerance, listener);
        expect(setFillStrokeStyleSpy.called).to.be(true);
        expect(drawPolygonSpy.called).to.be(true);
        setFillStrokeStyleSpy.restore();
        drawPolygonSpy.restore();
      });

      it('does render the multipolygon', function () {
        feature.setGeometry(
          new MultiPolygon([
            [
              [
                [0, 0],
                [1, 1],
                [1, 0],
                [0, 0],
              ],
            ],
          ]),
        );
        const polygonReplay = builderGroup.getBuilder(
          style.getZIndex(),
          'Polygon',
        );
        const setFillStrokeStyleSpy = sinonSpy(
          polygonReplay,
          'setFillStrokeStyle',
        );
        const drawMultiPolygonSpy = sinonStub(
          polygonReplay,
          'drawMultiPolygon',
        ).callsFake(VOID);
        renderFeature(builderGroup, feature, style, squaredTolerance, listener);
        expect(setFillStrokeStyleSpy.called).to.be(true);
        expect(drawMultiPolygonSpy.called).to.be(true);
        setFillStrokeStyleSpy.restore();
        drawMultiPolygonSpy.restore();
      });
    });
  });
});
