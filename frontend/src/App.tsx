import React, { useState } from 'react';
import { LRUCache } from './LRU';
import TreeVisualizer from './LCA/TreeVisualizer';
import FlattenView from './Flatten';
import './App.css';

const cache = new LRUCache(3); // Create a cache with a capacity of 3

function App() {
  const [activeTab, setActiveTab] = useState('tab1');
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [cacheContents, setCacheContents] = useState<string[]>([]);
  const [treeData, setTreeData] = useState('');
  const [p, setP] = useState('');
  const [q, setQ] = useState('');

  const handleGet = () => {
    const val = cache.get(Number(key));
    alert(`Value for key ${key}: ${val}`);
  };

  const handlePut = () => {
    cache.put(Number(key), Number(value));
    updateCacheContents();
  };

  const updateCacheContents = () => {
    const contents: string[] = [];
    cache.cache.forEach((node) => {
      contents.push(`Key: ${String(node.key)}, Value: ${node.value}`);
    });
    setCacheContents(contents);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="tabs">
        <button
          className={activeTab === 'tab1' ? 'active' : ''}
          onClick={() => handleTabClick('tab1')}
        >
          LRUCache Prototype
        </button>
        <button
          className={activeTab === 'tab2' ? 'active' : ''}
          onClick={() => handleTabClick('tab2')}
        >
          LCA Binary Tree
        </button>
        <button
          className={activeTab === 'tab3' ? 'active' : ''}
          onClick={() => handleTabClick('tab3')}
        >
          Flatten array + object
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'tab1' && ( // LRU Cache Prototype
          <div>
            <div>
              <div>
                <input
                  type="text"
                  placeholder="Key"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <button onClick={handlePut}>Put</button>
                <button onClick={handleGet}>Get</button>
              </div>
              <div>
                <h2>Cache Contents:</h2>
                {cacheContents.map((content, index) => (
                  <div key={index}>{content}</div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'tab2' && (
        <div>
          <div>
            <label>
              Tree Data:
              <input
                type="text"
                value={treeData}
                onChange={(e) => setTreeData(e.target.value)}
                placeholder="Enter tree data (e.g., [1,2,3,null,null,4,5])"
              />
            </label>
          </div>
          <div>
            <label>
              Node P Value:
              <input
                type="number" // Change to text to allow any character
                value={p}
                onChange={(e)=>setP(e.target.value)}
                placeholder="Enter P value"
              />
            </label>
          </div>
          <div>
            <label>
              Node Q Value:
              <input
                type="number" // Change to text to allow any character
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                placeholder="Enter Q value"
              />
            </label>
          </div>
          <TreeVisualizer tree={treeData} p={p} q={q} />
        </div>
      )}
        {activeTab === 'tab3' && (
          <div>
            <FlattenView />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
