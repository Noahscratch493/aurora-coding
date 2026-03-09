import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";

/* =========================
   Dynamic Sprite Dropdown
========================= */

function spriteDropdown(): [string, string][] {
  const runtime = (window as any).auroraRuntime;

  const options: [string, string][] = [
    ["mouse-pointer", "_mouse_"]
  ];

  if (runtime && runtime.sprites) {
    runtime.sprites.forEach((s: any) => {
      options.push([s.name || s.id, s.id]);
    });
  }

  return options;
}

/* =========================
   MOTION BLOCKS
========================= */

Blockly.Blocks["move_steps"] = {
  init: function () {
    this.appendValueInput("STEPS")
      .setCheck("Number")
      .appendField("move");

    this.appendDummyInput()
      .appendField("steps");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(220);
  }
};

Blockly.Blocks["turn_right"] = {
  init: function () {
    this.appendValueInput("DEG")
      .setCheck("Number")
      .appendField("turn ↻");

    this.appendDummyInput()
      .appendField("degrees");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(220);
  }
};

Blockly.Blocks["turn_left"] = {
  init: function () {
    this.appendValueInput("DEG")
      .setCheck("Number")
      .appendField("turn ↺");

    this.appendDummyInput()
      .appendField("degrees");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(220);
  }
};

Blockly.Blocks["point_direction"] = {
  init: function () {
    this.appendValueInput("DIR")
      .setCheck("Number")
      .appendField("point in direction");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(220);
  }
};

Blockly.Blocks["point_towards"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("point towards")
      .appendField(new Blockly.FieldDropdown(spriteDropdown), "TARGET");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(220);
  }
};

Blockly.Blocks["bounce_edge"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("if on edge, bounce");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(220);
  }
};

/* =========================
   GENERATORS
========================= */

javascriptGenerator.forBlock["move_steps"] = function (block: Blockly.Block) {
  const steps =
    javascriptGenerator.valueToCode(block, "STEPS", 0) || "10";

  return `
{
  const rad = sprite.direction * Math.PI / 180;
  sprite.x += Math.cos(rad) * ${steps};
  sprite.y += Math.sin(rad) * ${steps};
  await runtime.tick();
}
`;
};

javascriptGenerator.forBlock["turn_right"] = function (block: Blockly.Block) {
  const deg =
    javascriptGenerator.valueToCode(block, "DEG", 0) || "15";

  return `
sprite.direction += ${deg};
await runtime.tick();
`;
};

javascriptGenerator.forBlock["turn_left"] = function (block: Blockly.Block) {
  const deg =
    javascriptGenerator.valueToCode(block, "DEG", 0) || "15";

  return `
sprite.direction -= ${deg};
await runtime.tick();
`;
};

javascriptGenerator.forBlock["point_direction"] = function (block: Blockly.Block) {
  const dir =
    javascriptGenerator.valueToCode(block, "DIR", 0) || "90";

  return `
sprite.direction = ${dir};
await runtime.tick();
`;
};

javascriptGenerator.forBlock["point_towards"] = function (block: Blockly.Block) {
  const target = block.getFieldValue("TARGET");

  if (target === "_mouse_") {
    return `
{
  const dx = runtime.mouseX - sprite.x;
  const dy = runtime.mouseY - sprite.y;
  sprite.direction = Math.atan2(dy, dx) * 180 / Math.PI;
  await runtime.tick();
}
`;
  }

  return `
{
  const other = runtime.sprites.find((s:any)=>s.id === "${target}");
  if (other) {
    const dx = other.x - sprite.x;
    const dy = other.y - sprite.y;
    sprite.direction = Math.atan2(dy, dx) * 180 / Math.PI;
  }
  await runtime.tick();
}
`;
};

javascriptGenerator.forBlock["bounce_edge"] = function () {
  return `
if (sprite.x > 240 || sprite.x < -240) {
  sprite.direction = 180 - sprite.direction;
}
if (sprite.y > 180 || sprite.y < -180) {
  sprite.direction = -sprite.direction;
}
await runtime.tick();
`;
};

/* =========================
   TOOLBOX
========================= */

export function buildToolbox() {
  return {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Motion",
        colour: 220,
        contents: [
          {
            kind: "block",
            type: "move_steps",
            inputs: {
              STEPS: {
                shadow: {
                  type: "math_number",
                  fields: { NUM: 10 }
                }
              }
            }
          },
          {
            kind: "block",
            type: "turn_right",
            inputs: {
              DEG: {
                shadow: {
                  type: "math_number",
                  fields: { NUM: 15 }
                }
              }
            }
          },
          {
            kind: "block",
            type: "turn_left",
            inputs: {
              DEG: {
                shadow: {
                  type: "math_number",
                  fields: { NUM: 15 }
                }
              }
            }
          },
          {
            kind: "block",
            type: "point_direction",
            inputs: {
              DIR: {
                shadow: {
                  type: "math_number",
                  fields: { NUM: 90 }
                }
              }
            }
          },
          {
            kind: "block",
            type: "point_towards"
          },
          {
            kind: "block",
            type: "bounce_edge"
          }
        ]
      }
    ]
  };
}
