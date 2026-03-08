import * as Blockly from 'blockly';
import 'blockly/blocks';
import '@blockly/field-colour';
import { javascriptGenerator, Order } from 'blockly/javascript';

// ---- MOTION BLOCKS ----
Blockly.Blocks['move_steps'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('STEPS').setCheck('Number').appendField('move');
    this.appendDummyInput().appendField('steps');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(220);
  },
};

Blockly.Blocks['turn_right'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('DEGREES').setCheck('Number').appendField('turn ↻');
    this.appendDummyInput().appendField('degrees');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(220);
  },
};

Blockly.Blocks['turn_left'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('DEGREES').setCheck('Number').appendField('turn ↺');
    this.appendDummyInput().appendField('degrees');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(220);
  },
};

Blockly.Blocks['go_to_xy'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('X').setCheck('Number').appendField('go to x:');
    this.appendValueInput('Y').setCheck('Number').appendField('y:');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(220);
  },
};

Blockly.Blocks['glide_to_xy'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('SECS').setCheck('Number').appendField('glide');
    this.appendDummyInput().appendField('secs to');
    this.appendValueInput('X').setCheck('Number').appendField('x:');
    this.appendValueInput('Y').setCheck('Number').appendField('y:');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(220);
  },
};

Blockly.Blocks['set_x'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('X').setCheck('Number').appendField('set x to');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(220);
  },
};

Blockly.Blocks['set_y'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('Y').setCheck('Number').appendField('set y to');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(220);
  },
};

Blockly.Blocks['change_x'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('DX').setCheck('Number').appendField('change x by');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(220);
  },
};

Blockly.Blocks['change_y'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('DY').setCheck('Number').appendField('change y by');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(220);
  },
};

Blockly.Blocks['point_direction'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('DIR').setCheck('Number').appendField('point in direction');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(220);
  },
};

Blockly.Blocks['bounce_edge'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField('if on edge, bounce');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(220);
  },
};

Blockly.Blocks['set_draggable'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('set drag mode')
      .appendField(new Blockly.FieldDropdown([
        ['draggable', 'true'], ['not draggable', 'false'],
      ]), 'MODE');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(220);
  },
};

// ---- LOOKS BLOCKS ----
Blockly.Blocks['say_message'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('MSG').setCheck('String').appendField('say');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(280);
  },
};

Blockly.Blocks['say_for_secs'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('MSG').setCheck('String').appendField('say');
    this.appendValueInput('SECS').setCheck('Number').appendField('for');
    this.appendDummyInput().appendField('secs');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(280);
  },
};

Blockly.Blocks['think_message'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('MSG').setCheck('String').appendField('think');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(280);
  },
};

Blockly.Blocks['change_size'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('SIZE').setCheck('Number').appendField('change size by');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(280);
  },
};

Blockly.Blocks['set_size'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('SIZE').setCheck('Number').appendField('set size to');
    this.appendDummyInput().appendField('%');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(280);
  },
};

Blockly.Blocks['show_sprite'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField('show');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(280);
  },
};

Blockly.Blocks['hide_sprite'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField('hide');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(280);
  },
};

Blockly.Blocks['set_color_effect'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('VALUE').setCheck('Number').appendField('set color effect to');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(280);
  },
};

Blockly.Blocks['clear_effects'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField('clear graphic effects');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(280);
  },
};

// Costume blocks
Blockly.Blocks['next_costume'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField('next costume');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(280);
  },
};

Blockly.Blocks['prev_costume'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField('previous costume');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(280);
  },
};

Blockly.Blocks['switch_costume'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('NAME').setCheck('String').appendField('switch costume to');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(280);
  },
};

Blockly.Blocks['flip_costume'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('flip')
      .appendField(new Blockly.FieldDropdown([
        ['left-right', 'horizontal'], ['up-down', 'vertical'],
      ]), 'DIRECTION');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(280);
  },
};

Blockly.Blocks['set_rotation_style'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('set rotation style')
      .appendField(new Blockly.FieldDropdown([
        ['left-right', 'left-right'],
        ['don\'t rotate', 'dont-rotate'],
        ['all around', 'all-around'],
      ]), 'STYLE');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(220);
  },
};

Blockly.Blocks['point_towards'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('point towards')
      .appendField(new Blockly.FieldDropdown([
        ['mouse-pointer', '_mouse_'],
        ['right (90)', '90'],
        ['left (-90)', '-90'],
        ['up (0)', '0'],
        ['down (180)', '180'],
      ]), 'TARGET');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(220);
  },
};

Blockly.Blocks['costume_number'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField('costume #');
    this.setOutput(true, 'Number');
    this.setColour(280);
  },
};

Blockly.Blocks['costume_name'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField('costume name');
    this.setOutput(true, 'String');
    this.setColour(280);
  },
};

// ---- EVENTS BLOCKS ----
Blockly.Blocks['when_flag_clicked'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField('when 🚩 clicked');
    this.setNextStatement(true, null);
    this.setColour(45);
  },
};

Blockly.Blocks['when_key_pressed'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('when')
      .appendField(new Blockly.FieldDropdown([
        ['space', 'space'], ['up arrow', 'ArrowUp'], ['down arrow', 'ArrowDown'],
        ['left arrow', 'ArrowLeft'], ['right arrow', 'ArrowRight'],
        ['a', 'a'], ['b', 'b'], ['c', 'c'], ['d', 'd'], ['w', 'w'], ['s', 's'],
      ]), 'KEY')
      .appendField('key pressed');
    this.setNextStatement(true, null);
    this.setColour(45);
  },
};

Blockly.Blocks['when_sprite_clicked'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField('when this sprite clicked');
    this.setNextStatement(true, null);
    this.setColour(45);
  },
};

Blockly.Blocks['broadcast_message'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('MSG').setCheck('String').appendField('broadcast');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
  },
};

Blockly.Blocks['when_receive_message'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('MSG').setCheck('String').appendField('when I receive');
    this.setNextStatement(true, null);
    this.setColour(45);
  },
};

// ---- CONTROL BLOCKS ----
Blockly.Blocks['wait_seconds'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('SECS').setCheck('Number').appendField('wait');
    this.appendDummyInput().appendField('seconds');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(30);
  },
};

Blockly.Blocks['repeat_times'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('TIMES').setCheck('Number').appendField('repeat');
    this.appendStatementInput('DO').appendField('do');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(30);
  },
};

Blockly.Blocks['forever_loop'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField('forever');
    this.appendStatementInput('DO');
    this.setPreviousStatement(true, null);
    this.setColour(30);
  },
};

Blockly.Blocks['if_then'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('CONDITION').setCheck('Boolean').appendField('if');
    this.appendStatementInput('DO').appendField('then');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(30);
  },
};

Blockly.Blocks['if_then_else'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('CONDITION').setCheck('Boolean').appendField('if');
    this.appendStatementInput('DO').appendField('then');
    this.appendStatementInput('ELSE').appendField('else');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(30);
  },
};

Blockly.Blocks['wait_until'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('CONDITION').setCheck('Boolean').appendField('wait until');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(30);
  },
};

Blockly.Blocks['repeat_until'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('CONDITION').setCheck('Boolean').appendField('repeat until');
    this.appendStatementInput('DO');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(30);
  },
};

Blockly.Blocks['stop_all'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField('stop all');
    this.setPreviousStatement(true, null);
    this.setColour(30);
  },
};

// ---- OPERATOR BLOCKS ----
Blockly.Blocks['math_add'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('A').setCheck('Number');
    this.appendValueInput('B').setCheck('Number').appendField('+');
    this.setOutput(true, 'Number');
    this.setColour(160);
  },
};

Blockly.Blocks['math_subtract'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('A').setCheck('Number');
    this.appendValueInput('B').setCheck('Number').appendField('−');
    this.setOutput(true, 'Number');
    this.setColour(160);
  },
};

Blockly.Blocks['math_multiply'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('A').setCheck('Number');
    this.appendValueInput('B').setCheck('Number').appendField('×');
    this.setOutput(true, 'Number');
    this.setColour(160);
  },
};

Blockly.Blocks['math_divide'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('A').setCheck('Number');
    this.appendValueInput('B').setCheck('Number').appendField('÷');
    this.setOutput(true, 'Number');
    this.setColour(160);
  },
};

Blockly.Blocks['pick_random'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('FROM').setCheck('Number').appendField('pick random');
    this.appendValueInput('TO').setCheck('Number').appendField('to');
    this.setOutput(true, 'Number');
    this.setColour(160);
  },
};

Blockly.Blocks['compare_gt'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('A').setCheck('Number');
    this.appendValueInput('B').setCheck('Number').appendField('>');
    this.setOutput(true, 'Boolean');
    this.setColour(160);
  },
};

Blockly.Blocks['compare_lt'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('A').setCheck('Number');
    this.appendValueInput('B').setCheck('Number').appendField('<');
    this.setOutput(true, 'Boolean');
    this.setColour(160);
  },
};

Blockly.Blocks['compare_eq'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('A');
    this.appendValueInput('B').appendField('=');
    this.setOutput(true, 'Boolean');
    this.setColour(160);
  },
};

Blockly.Blocks['logic_and'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('A').setCheck('Boolean');
    this.appendValueInput('B').setCheck('Boolean').appendField('and');
    this.setOutput(true, 'Boolean');
    this.setColour(160);
  },
};

Blockly.Blocks['logic_or'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('A').setCheck('Boolean');
    this.appendValueInput('B').setCheck('Boolean').appendField('or');
    this.setOutput(true, 'Boolean');
    this.setColour(160);
  },
};

Blockly.Blocks['logic_not'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('A').setCheck('Boolean').appendField('not');
    this.setOutput(true, 'Boolean');
    this.setColour(160);
  },
};

Blockly.Blocks['join_strings'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('A').setCheck('String').appendField('join');
    this.appendValueInput('B').setCheck('String');
    this.setOutput(true, 'String');
    this.setColour(160);
  },
};

Blockly.Blocks['math_mod'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('A').setCheck('Number');
    this.appendValueInput('B').setCheck('Number').appendField('mod');
    this.setOutput(true, 'Number');
    this.setColour(160);
  },
};

Blockly.Blocks['math_round'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('NUM').setCheck('Number').appendField('round');
    this.setOutput(true, 'Number');
    this.setColour(160);
  },
};

Blockly.Blocks['math_abs'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('NUM').setCheck('Number').appendField(
      new Blockly.FieldDropdown([
        ['abs', 'abs'], ['floor', 'floor'], ['ceiling', 'ceil'],
        ['sqrt', 'sqrt'], ['sin', 'sin'], ['cos', 'cos'], ['tan', 'tan'],
      ]), 'OP'
    ).appendField('of');
    this.setOutput(true, 'Number');
    this.setColour(160);
  },
};

// ---- SENSING BLOCKS ----
Blockly.Blocks['touching'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('touching')
      .appendField(new Blockly.FieldDropdown([
        ['mouse-pointer', '_mouse_'],
        ['edge', '_edge_'],
      ]), 'TARGET')
      .appendField('?');
    this.setOutput(true, 'Boolean');
    this.setColour(185);
  },
};

Blockly.Blocks['touching_edge'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField('touching edge?');
    this.setOutput(true, 'Boolean');
    this.setColour(185);
  },
};

Blockly.Blocks['mouse_x'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField('mouse x');
    this.setOutput(true, 'Number');
    this.setColour(185);
  },
};

Blockly.Blocks['mouse_y'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField('mouse y');
    this.setOutput(true, 'Number');
    this.setColour(185);
  },
};

Blockly.Blocks['key_pressed'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('key')
      .appendField(new Blockly.FieldDropdown([
        ['space', 'space'], ['up arrow', 'ArrowUp'], ['down arrow', 'ArrowDown'],
        ['left arrow', 'ArrowLeft'], ['right arrow', 'ArrowRight'],
        ['a', 'a'], ['w', 'w'], ['s', 's'], ['d', 'd'],
      ]), 'KEY')
      .appendField('pressed?');
    this.setOutput(true, 'Boolean');
    this.setColour(185);
  },
};

Blockly.Blocks['ask_and_wait'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('QUESTION').setCheck('String').appendField('ask');
    this.appendDummyInput().appendField('and wait');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(185);
  },
};

Blockly.Blocks['answer'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField('answer');
    this.setOutput(true, 'String');
    this.setColour(185);
  },
};

Blockly.Blocks['x_position'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField('x position');
    this.setOutput(true, 'Number');
    this.setColour(220);
  },
};

Blockly.Blocks['y_position'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField('y position');
    this.setOutput(true, 'Number');
    this.setColour(220);
  },
};

Blockly.Blocks['direction_reporter'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField('direction');
    this.setOutput(true, 'Number');
    this.setColour(220);
  },
};

Blockly.Blocks['size_reporter'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField('size');
    this.setOutput(true, 'Number');
    this.setColour(280);
  },
};

// ---- EXTENSION BLOCKS ----
// Iframe
Blockly.Blocks['iframe_show'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('URL').setCheck('String').appendField('show iframe');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(195);
  },
};

Blockly.Blocks['iframe_hide'] = {
  init(this: Blockly.Block) {
    this.appendDummyInput().appendField('hide iframe');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(195);
  },
};

// Fetch
Blockly.Blocks['fetch_url'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('URL').setCheck('String').appendField('fetch');
    this.setOutput(true, 'String');
    this.setColour(330);
  },
};

Blockly.Blocks['fetch_json_field'] = {
  init(this: Blockly.Block) {
    this.appendValueInput('DATA').setCheck('String').appendField('get field');
    this.appendValueInput('FIELD').setCheck('String').appendField('from');
    this.setOutput(true, 'String');
    this.setColour(330);
  },
};

// ---- CODE GENERATORS ----

if (!javascriptGenerator.forBlock['math_number']) {
  javascriptGenerator.forBlock['math_number'] = function(block: Blockly.Block) {
    const num = Number(block.getFieldValue('NUM'));
    return [String(num), Order.ATOMIC];
  };
}

if (!javascriptGenerator.forBlock['text']) {
  javascriptGenerator.forBlock['text'] = function(block: Blockly.Block) {
    const text = block.getFieldValue('TEXT') || '';
    return [`'${text.replace(/'/g, "\\'")}'`, Order.ATOMIC];
  };
}

javascriptGenerator.forBlock['move_steps'] = function(block: Blockly.Block) {
  const steps = javascriptGenerator.valueToCode(block, 'STEPS', Order.ATOMIC) || '10';
  return `await sprite.move(${steps});\n`;
};

javascriptGenerator.forBlock['turn_right'] = function(block: Blockly.Block) {
  const deg = javascriptGenerator.valueToCode(block, 'DEGREES', Order.ATOMIC) || '15';
  return `await sprite.turnRight(${deg});\n`;
};

javascriptGenerator.forBlock['turn_left'] = function(block: Blockly.Block) {
  const deg = javascriptGenerator.valueToCode(block, 'DEGREES', Order.ATOMIC) || '15';
  return `await sprite.turnLeft(${deg});\n`;
};

javascriptGenerator.forBlock['go_to_xy'] = function(block: Blockly.Block) {
  const x = javascriptGenerator.valueToCode(block, 'X', Order.ATOMIC) || '0';
  const y = javascriptGenerator.valueToCode(block, 'Y', Order.ATOMIC) || '0';
  return `await sprite.goTo(${x}, ${y});\n`;
};

javascriptGenerator.forBlock['glide_to_xy'] = function(block: Blockly.Block) {
  const secs = javascriptGenerator.valueToCode(block, 'SECS', Order.ATOMIC) || '1';
  const x = javascriptGenerator.valueToCode(block, 'X', Order.ATOMIC) || '0';
  const y = javascriptGenerator.valueToCode(block, 'Y', Order.ATOMIC) || '0';
  return `await sprite.glideTo(${secs}, ${x}, ${y});\n`;
};

javascriptGenerator.forBlock['set_x'] = function(block: Blockly.Block) {
  const x = javascriptGenerator.valueToCode(block, 'X', Order.ATOMIC) || '0';
  return `await sprite.setX(${x});\n`;
};

javascriptGenerator.forBlock['set_y'] = function(block: Blockly.Block) {
  const y = javascriptGenerator.valueToCode(block, 'Y', Order.ATOMIC) || '0';
  return `await sprite.setY(${y});\n`;
};

javascriptGenerator.forBlock['change_x'] = function(block: Blockly.Block) {
  const dx = javascriptGenerator.valueToCode(block, 'DX', Order.ATOMIC) || '10';
  return `await sprite.changeX(${dx});\n`;
};

javascriptGenerator.forBlock['change_y'] = function(block: Blockly.Block) {
  const dy = javascriptGenerator.valueToCode(block, 'DY', Order.ATOMIC) || '10';
  return `await sprite.changeY(${dy});\n`;
};

javascriptGenerator.forBlock['point_direction'] = function(block: Blockly.Block) {
  const dir = javascriptGenerator.valueToCode(block, 'DIR', Order.ATOMIC) || '90';
  return `sprite.direction = ${dir};\nawait runtime.tick();\n`;
};

javascriptGenerator.forBlock['bounce_edge'] = function() {
  return `sprite.bounceOffEdge();\n`;
};

javascriptGenerator.forBlock['set_draggable'] = function(block: Blockly.Block) {
  const mode = block.getFieldValue('MODE');
  return `sprite.setDraggable(${mode});\n`;
};

javascriptGenerator.forBlock['say_message'] = function(block: Blockly.Block) {
  const msg = javascriptGenerator.valueToCode(block, 'MSG', Order.ATOMIC) || "''";
  return `await sprite.say(${msg});\n`;
};

javascriptGenerator.forBlock['say_for_secs'] = function(block: Blockly.Block) {
  const msg = javascriptGenerator.valueToCode(block, 'MSG', Order.ATOMIC) || "''";
  const secs = javascriptGenerator.valueToCode(block, 'SECS', Order.ATOMIC) || '2';
  return `await sprite.sayFor(${msg}, ${secs});\n`;
};

javascriptGenerator.forBlock['think_message'] = function(block: Blockly.Block) {
  const msg = javascriptGenerator.valueToCode(block, 'MSG', Order.ATOMIC) || "''";
  return `await sprite.think(${msg});\n`;
};

javascriptGenerator.forBlock['change_size'] = function(block: Blockly.Block) {
  const size = javascriptGenerator.valueToCode(block, 'SIZE', Order.ATOMIC) || '10';
  return `sprite.changeSize(${size});\nawait runtime.tick();\n`;
};

javascriptGenerator.forBlock['set_size'] = function(block: Blockly.Block) {
  const size = javascriptGenerator.valueToCode(block, 'SIZE', Order.ATOMIC) || '100';
  return `sprite.setSize(${size});\nawait runtime.tick();\n`;
};

javascriptGenerator.forBlock['show_sprite'] = function() {
  return `sprite.visible = true;\n`;
};

javascriptGenerator.forBlock['hide_sprite'] = function() {
  return `sprite.visible = false;\n`;
};

javascriptGenerator.forBlock['set_color_effect'] = function(block: Blockly.Block) {
  const val = javascriptGenerator.valueToCode(block, 'VALUE', Order.ATOMIC) || '0';
  return `sprite.colorEffect = ${val};\n`;
};

javascriptGenerator.forBlock['clear_effects'] = function() {
  return `sprite.clearEffects();\n`;
};

javascriptGenerator.forBlock['next_costume'] = function() {
  return `sprite.nextCostume();\nawait runtime.tick();\n`;
};

javascriptGenerator.forBlock['prev_costume'] = function() {
  return `sprite.prevCostume();\nawait runtime.tick();\n`;
};

javascriptGenerator.forBlock['switch_costume'] = function(block: Blockly.Block) {
  const name = javascriptGenerator.valueToCode(block, 'NAME', Order.ATOMIC) || "''";
  return `sprite.switchCostume(${name});\nawait runtime.tick();\n`;
};

javascriptGenerator.forBlock['flip_costume'] = function(block: Blockly.Block) {
  const dir = block.getFieldValue('DIRECTION');
  return `sprite.flipCostume('${dir}');\nawait runtime.tick();\n`;
};

javascriptGenerator.forBlock['costume_number'] = function() {
  return [`sprite.costumeNumber`, Order.ATOMIC];
};

javascriptGenerator.forBlock['costume_name'] = function() {
  return [`sprite.costumeName`, Order.ATOMIC];
};

javascriptGenerator.forBlock['x_position'] = function() {
  return [`sprite.x`, Order.ATOMIC];
};

javascriptGenerator.forBlock['y_position'] = function() {
  return [`sprite.y`, Order.ATOMIC];
};

javascriptGenerator.forBlock['direction_reporter'] = function() {
  return [`sprite.direction`, Order.ATOMIC];
};

javascriptGenerator.forBlock['size_reporter'] = function() {
  return [`sprite.size`, Order.ATOMIC];
};

// Events
javascriptGenerator.forBlock['when_flag_clicked'] = function() {
  return '';
};

javascriptGenerator.forBlock['when_key_pressed'] = function(block: Blockly.Block) {
  const key = block.getFieldValue('KEY');
  return `// KEY_EVENT: ${key}\n`;
};

javascriptGenerator.forBlock['when_sprite_clicked'] = function() {
  return `// SPRITE_CLICK_EVENT\n`;
};

javascriptGenerator.forBlock['broadcast_message'] = function(block: Blockly.Block) {
  const msg = javascriptGenerator.valueToCode(block, 'MSG', Order.ATOMIC) || "''";
  return `runtime.broadcast(${msg});\n`;
};

javascriptGenerator.forBlock['when_receive_message'] = function(block: Blockly.Block) {
  const msg = javascriptGenerator.valueToCode(block, 'MSG', Order.ATOMIC) || "''";
  return `// RECEIVE_EVENT: ${msg}\n`;
};

javascriptGenerator.forBlock['wait_seconds'] = function(block: Blockly.Block) {
  const secs = javascriptGenerator.valueToCode(block, 'SECS', Order.ATOMIC) || '1';
  return `await runtime.wait(${secs});\n`;
};

javascriptGenerator.forBlock['repeat_times'] = function(block: Blockly.Block) {
  const times = javascriptGenerator.valueToCode(block, 'TIMES', Order.ATOMIC) || '10';
  const body = javascriptGenerator.statementToCode(block, 'DO');
  return `for (let __i = 0; __i < ${times}; __i++) {\n${body}  await runtime.tick();\n}\n`;
};

javascriptGenerator.forBlock['forever_loop'] = function(block: Blockly.Block) {
  const body = javascriptGenerator.statementToCode(block, 'DO');
  return `while (runtime.running) {\n${body}  await runtime.tick();\n}\n`;
};

javascriptGenerator.forBlock['if_then'] = function(block: Blockly.Block) {
  const cond = javascriptGenerator.valueToCode(block, 'CONDITION', Order.ATOMIC) || 'false';
  const body = javascriptGenerator.statementToCode(block, 'DO');
  return `if (${cond}) {\n${body}}\n`;
};

javascriptGenerator.forBlock['if_then_else'] = function(block: Blockly.Block) {
  const cond = javascriptGenerator.valueToCode(block, 'CONDITION', Order.ATOMIC) || 'false';
  const body = javascriptGenerator.statementToCode(block, 'DO');
  const elseBody = javascriptGenerator.statementToCode(block, 'ELSE');
  return `if (${cond}) {\n${body}} else {\n${elseBody}}\n`;
};

javascriptGenerator.forBlock['wait_until'] = function(block: Blockly.Block) {
  const cond = javascriptGenerator.valueToCode(block, 'CONDITION', Order.ATOMIC) || 'false';
  return `while (!(${cond}) && runtime.running) { await runtime.tick(); }\n`;
};

javascriptGenerator.forBlock['repeat_until'] = function(block: Blockly.Block) {
  const cond = javascriptGenerator.valueToCode(block, 'CONDITION', Order.ATOMIC) || 'false';
  const body = javascriptGenerator.statementToCode(block, 'DO');
  return `while (!(${cond}) && runtime.running) {\n${body}  await runtime.tick();\n}\n`;
};

javascriptGenerator.forBlock['stop_all'] = function() {
  return `runtime.stopAll();\n`;
};

// Operators
javascriptGenerator.forBlock['math_add'] = function(block: Blockly.Block) {
  const a = javascriptGenerator.valueToCode(block, 'A', Order.ADDITION) || '0';
  const b = javascriptGenerator.valueToCode(block, 'B', Order.ADDITION) || '0';
  return [`(${a} + ${b})`, Order.ADDITION];
};

javascriptGenerator.forBlock['math_subtract'] = function(block: Blockly.Block) {
  const a = javascriptGenerator.valueToCode(block, 'A', Order.SUBTRACTION) || '0';
  const b = javascriptGenerator.valueToCode(block, 'B', Order.SUBTRACTION) || '0';
  return [`(${a} - ${b})`, Order.SUBTRACTION];
};

javascriptGenerator.forBlock['math_multiply'] = function(block: Blockly.Block) {
  const a = javascriptGenerator.valueToCode(block, 'A', Order.MULTIPLICATION) || '0';
  const b = javascriptGenerator.valueToCode(block, 'B', Order.MULTIPLICATION) || '0';
  return [`(${a} * ${b})`, Order.MULTIPLICATION];
};

javascriptGenerator.forBlock['math_divide'] = function(block: Blockly.Block) {
  const a = javascriptGenerator.valueToCode(block, 'A', Order.DIVISION) || '0';
  const b = javascriptGenerator.valueToCode(block, 'B', Order.DIVISION) || '1';
  return [`(${a} / ${b})`, Order.DIVISION];
};

javascriptGenerator.forBlock['pick_random'] = function(block: Blockly.Block) {
  const from = javascriptGenerator.valueToCode(block, 'FROM', Order.ATOMIC) || '1';
  const to = javascriptGenerator.valueToCode(block, 'TO', Order.ATOMIC) || '10';
  return [`runtime.random(${from}, ${to})`, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['compare_gt'] = function(block: Blockly.Block) {
  const a = javascriptGenerator.valueToCode(block, 'A', Order.RELATIONAL) || '0';
  const b = javascriptGenerator.valueToCode(block, 'B', Order.RELATIONAL) || '0';
  return [`(${a} > ${b})`, Order.RELATIONAL];
};

javascriptGenerator.forBlock['compare_lt'] = function(block: Blockly.Block) {
  const a = javascriptGenerator.valueToCode(block, 'A', Order.RELATIONAL) || '0';
  const b = javascriptGenerator.valueToCode(block, 'B', Order.RELATIONAL) || '0';
  return [`(${a} < ${b})`, Order.RELATIONAL];
};

javascriptGenerator.forBlock['compare_eq'] = function(block: Blockly.Block) {
  const a = javascriptGenerator.valueToCode(block, 'A', Order.EQUALITY) || '0';
  const b = javascriptGenerator.valueToCode(block, 'B', Order.EQUALITY) || '0';
  return [`(${a} == ${b})`, Order.EQUALITY];
};

javascriptGenerator.forBlock['logic_and'] = function(block: Blockly.Block) {
  const a = javascriptGenerator.valueToCode(block, 'A', Order.LOGICAL_AND) || 'false';
  const b = javascriptGenerator.valueToCode(block, 'B', Order.LOGICAL_AND) || 'false';
  return [`(${a} && ${b})`, Order.LOGICAL_AND];
};

javascriptGenerator.forBlock['logic_or'] = function(block: Blockly.Block) {
  const a = javascriptGenerator.valueToCode(block, 'A', Order.LOGICAL_OR) || 'false';
  const b = javascriptGenerator.valueToCode(block, 'B', Order.LOGICAL_OR) || 'false';
  return [`(${a} || ${b})`, Order.LOGICAL_OR];
};

javascriptGenerator.forBlock['logic_not'] = function(block: Blockly.Block) {
  const a = javascriptGenerator.valueToCode(block, 'A', Order.LOGICAL_NOT) || 'false';
  return [`!(${a})`, Order.LOGICAL_NOT];
};

javascriptGenerator.forBlock['join_strings'] = function(block: Blockly.Block) {
  const a = javascriptGenerator.valueToCode(block, 'A', Order.ATOMIC) || "''";
  const b = javascriptGenerator.valueToCode(block, 'B', Order.ATOMIC) || "''";
  return [`(String(${a}) + String(${b}))`, Order.ADDITION];
};

javascriptGenerator.forBlock['math_mod'] = function(block: Blockly.Block) {
  const a = javascriptGenerator.valueToCode(block, 'A', Order.MODULUS) || '0';
  const b = javascriptGenerator.valueToCode(block, 'B', Order.MODULUS) || '1';
  return [`(${a} % ${b})`, Order.MODULUS];
};

javascriptGenerator.forBlock['math_round'] = function(block: Blockly.Block) {
  const num = javascriptGenerator.valueToCode(block, 'NUM', Order.ATOMIC) || '0';
  return [`Math.round(${num})`, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['math_abs'] = function(block: Blockly.Block) {
  const op = block.getFieldValue('OP');
  const num = javascriptGenerator.valueToCode(block, 'NUM', Order.ATOMIC) || '0';
  return [`Math.${op}(${num})`, Order.FUNCTION_CALL];
};

// Sensing
javascriptGenerator.forBlock['touching'] = function(block: Blockly.Block) {
  const target = block.getFieldValue('TARGET');
  return [`sprite.isTouching('${target}')`, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['touching_edge'] = function() {
  return [`sprite.isTouchingEdge()`, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['mouse_x'] = function() {
  return [`runtime.mouseX`, Order.ATOMIC];
};

javascriptGenerator.forBlock['mouse_y'] = function() {
  return [`runtime.mouseY`, Order.ATOMIC];
};

javascriptGenerator.forBlock['key_pressed'] = function(block: Blockly.Block) {
  const key = block.getFieldValue('KEY');
  return [`runtime.isKeyPressed('${key}')`, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['ask_and_wait'] = function(block: Blockly.Block) {
  const q = javascriptGenerator.valueToCode(block, 'QUESTION', Order.ATOMIC) || "''";
  return `await runtime.ask(${q});\n`;
};

javascriptGenerator.forBlock['answer'] = function() {
  return [`runtime.answer`, Order.ATOMIC];
};

// Extension generators
javascriptGenerator.forBlock['iframe_show'] = function(block: Blockly.Block) {
  const url = javascriptGenerator.valueToCode(block, 'URL', Order.ATOMIC) || "''";
  return `runtime.showIframe(${url});\n`;
};

javascriptGenerator.forBlock['iframe_hide'] = function() {
  return `runtime.hideIframe();\n`;
};

javascriptGenerator.forBlock['fetch_url'] = function(block: Blockly.Block) {
  const url = javascriptGenerator.valueToCode(block, 'URL', Order.ATOMIC) || "''";
  return [`await runtime.fetchUrl(${url})`, Order.AWAIT];
};

javascriptGenerator.forBlock['fetch_json_field'] = function(block: Blockly.Block) {
  const data = javascriptGenerator.valueToCode(block, 'DATA', Order.ATOMIC) || "'{}'";
  const field = javascriptGenerator.valueToCode(block, 'FIELD', Order.ATOMIC) || "''";
  return [`runtime.getJsonField(${data}, ${field})`, Order.FUNCTION_CALL];
};

// Toolbox definition
export function buildToolbox(enabledExtensions: string[] = []) {
  const contents: any[] = [
    {
      kind: 'category',
      name: '🚀 Motion',
      colour: '#4C97FF',
      contents: [
        { kind: 'block', type: 'move_steps', inputs: { STEPS: { shadow: { type: 'math_number', fields: { NUM: 10 }}}}},
        { kind: 'block', type: 'turn_right', inputs: { DEGREES: { shadow: { type: 'math_number', fields: { NUM: 15 }}}}},
        { kind: 'block', type: 'turn_left', inputs: { DEGREES: { shadow: { type: 'math_number', fields: { NUM: 15 }}}}},
        { kind: 'block', type: 'go_to_xy', inputs: { X: { shadow: { type: 'math_number', fields: { NUM: 0 }}}, Y: { shadow: { type: 'math_number', fields: { NUM: 0 }}}}},
        { kind: 'block', type: 'glide_to_xy', inputs: { SECS: { shadow: { type: 'math_number', fields: { NUM: 1 }}}, X: { shadow: { type: 'math_number', fields: { NUM: 0 }}}, Y: { shadow: { type: 'math_number', fields: { NUM: 0 }}}}},
        { kind: 'block', type: 'set_x', inputs: { X: { shadow: { type: 'math_number', fields: { NUM: 0 }}}}},
        { kind: 'block', type: 'set_y', inputs: { Y: { shadow: { type: 'math_number', fields: { NUM: 0 }}}}},
        { kind: 'block', type: 'change_x', inputs: { DX: { shadow: { type: 'math_number', fields: { NUM: 10 }}}}},
        { kind: 'block', type: 'change_y', inputs: { DY: { shadow: { type: 'math_number', fields: { NUM: 10 }}}}},
        { kind: 'block', type: 'point_direction', inputs: { DIR: { shadow: { type: 'math_number', fields: { NUM: 90 }}}}},
        { kind: 'block', type: 'bounce_edge' },
        { kind: 'block', type: 'set_draggable' },
        { kind: 'sep', gap: 16 },
        { kind: 'block', type: 'x_position' },
        { kind: 'block', type: 'y_position' },
        { kind: 'block', type: 'direction_reporter' },
      ],
    },
    {
      kind: 'category',
      name: '✨ Looks',
      colour: '#9966FF',
      contents: [
        { kind: 'block', type: 'say_message', inputs: { MSG: { shadow: { type: 'text', fields: { TEXT: 'Hello!' }}}}},
        { kind: 'block', type: 'say_for_secs', inputs: { MSG: { shadow: { type: 'text', fields: { TEXT: 'Hello!' }}}, SECS: { shadow: { type: 'math_number', fields: { NUM: 2 }}}}},
        { kind: 'block', type: 'think_message', inputs: { MSG: { shadow: { type: 'text', fields: { TEXT: 'Hmm...' }}}}},
        { kind: 'sep', gap: 16 },
        { kind: 'block', type: 'next_costume' },
        { kind: 'block', type: 'prev_costume' },
        { kind: 'block', type: 'switch_costume', inputs: { NAME: { shadow: { type: 'text', fields: { TEXT: 'Default' }}}}},
        { kind: 'block', type: 'flip_costume' },
        { kind: 'block', type: 'costume_number' },
        { kind: 'block', type: 'costume_name' },
        { kind: 'sep', gap: 16 },
        { kind: 'block', type: 'change_size', inputs: { SIZE: { shadow: { type: 'math_number', fields: { NUM: 10 }}}}},
        { kind: 'block', type: 'set_size', inputs: { SIZE: { shadow: { type: 'math_number', fields: { NUM: 100 }}}}},
        { kind: 'block', type: 'size_reporter' },
        { kind: 'sep', gap: 16 },
        { kind: 'block', type: 'show_sprite' },
        { kind: 'block', type: 'hide_sprite' },
        { kind: 'block', type: 'set_color_effect', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 25 }}}}},
        { kind: 'block', type: 'clear_effects' },
      ],
    },
    {
      kind: 'category',
      name: '⚡ Events',
      colour: '#FFD500',
      contents: [
        { kind: 'block', type: 'when_flag_clicked' },
        { kind: 'block', type: 'when_key_pressed' },
        { kind: 'block', type: 'when_sprite_clicked' },
        { kind: 'block', type: 'broadcast_message', inputs: { MSG: { shadow: { type: 'text', fields: { TEXT: 'message1' }}}}},
        { kind: 'block', type: 'when_receive_message', inputs: { MSG: { shadow: { type: 'text', fields: { TEXT: 'message1' }}}}},
      ],
    },
    {
      kind: 'category',
      name: '🔄 Control',
      colour: '#FFAB19',
      contents: [
        { kind: 'block', type: 'wait_seconds', inputs: { SECS: { shadow: { type: 'math_number', fields: { NUM: 1 }}}}},
        { kind: 'block', type: 'repeat_times', inputs: { TIMES: { shadow: { type: 'math_number', fields: { NUM: 10 }}}}},
        { kind: 'block', type: 'forever_loop' },
        { kind: 'block', type: 'if_then' },
        { kind: 'block', type: 'if_then_else' },
        { kind: 'block', type: 'wait_until' },
        { kind: 'block', type: 'repeat_until' },
        { kind: 'block', type: 'stop_all' },
      ],
    },
    {
      kind: 'category',
      name: '🧮 Operators',
      colour: '#40BF4A',
      contents: [
        { kind: 'block', type: 'math_add' },
        { kind: 'block', type: 'math_subtract' },
        { kind: 'block', type: 'math_multiply' },
        { kind: 'block', type: 'math_divide' },
        { kind: 'block', type: 'pick_random' },
        { kind: 'block', type: 'compare_gt' },
        { kind: 'block', type: 'compare_lt' },
        { kind: 'block', type: 'compare_eq' },
        { kind: 'block', type: 'logic_and' },
        { kind: 'block', type: 'logic_or' },
        { kind: 'block', type: 'logic_not' },
        { kind: 'block', type: 'join_strings' },
        { kind: 'block', type: 'math_mod' },
        { kind: 'block', type: 'math_round' },
        { kind: 'block', type: 'math_abs' },
      ],
    },
    {
      kind: 'category',
      name: '👁 Sensing',
      colour: '#5CB1D6',
      contents: [
        { kind: 'block', type: 'touching' },
        { kind: 'block', type: 'touching_edge' },
        { kind: 'block', type: 'mouse_x' },
        { kind: 'block', type: 'mouse_y' },
        { kind: 'block', type: 'key_pressed' },
        { kind: 'block', type: 'ask_and_wait', inputs: { QUESTION: { shadow: { type: 'text', fields: { TEXT: "What's your name?" }}}}},
        { kind: 'block', type: 'answer' },
      ],
    },
    {
      kind: 'category',
      name: '📦 Variables',
      colour: '#FF8C1A',
      custom: 'VARIABLE',
    },
  ];

  // More category with extensions
  const moreContents: any[] = [];

  if (enabledExtensions.includes('iframe')) {
    moreContents.push(
      { kind: 'label', text: '── Iframe ──' },
      { kind: 'block', type: 'iframe_show', inputs: { URL: { shadow: { type: 'text', fields: { TEXT: 'https://example.com' }}}}},
      { kind: 'block', type: 'iframe_hide' },
    );
  }

  if (enabledExtensions.includes('fetch')) {
    moreContents.push(
      { kind: 'label', text: '── Fetch ──' },
      { kind: 'block', type: 'fetch_url', inputs: { URL: { shadow: { type: 'text', fields: { TEXT: 'https://api.example.com/data' }}}}},
      { kind: 'block', type: 'fetch_json_field' },
    );
  }

  // Always show the More category
  contents.push({
    kind: 'category',
    name: '➕ More',
    colour: '#7C8EA6',
    contents: moreContents.length > 0
      ? moreContents
      : [{ kind: 'label', text: 'Enable extensions in the editor to add blocks here.' }],
  });

  return { kind: 'categoryToolbox', contents };
}

export const AURORA_TOOLBOX = buildToolbox();
